import ConduitGrpcSdk from "@quintessential-sft/conduit-grpc-sdk";
import { constructQuery, constructAssignment, getOpName } from "./utils";
import grpc from "grpc";
import { CustomEndpoint } from "../../models/customEndpoint";

export class CustomEndpointHandler {
  private static routeControllers: { [name: string]: any } = {};

  static addNewCustomOperationControl(endpoint: CustomEndpoint) {
    CustomEndpointHandler.routeControllers[endpoint.name] = endpoint;
  }

  constructor(private readonly grpcSdk: ConduitGrpcSdk) {}

  entryPoint(call: any, callback: any) {
    //use it to find the right controller
    let path = call.request.path.split("/")[2];
    let endpoint: CustomEndpoint = CustomEndpointHandler.routeControllers[path];
    let params = JSON.parse(call.request.params);
    let searchString = "";
    let createString = "";

    if ('params' in params) {
      params = params.params;
    }

    // if operation is not POST (CREATE)
    if (endpoint.operation !== 1) {
      endpoint.queries!.forEach(
        (r: { schemaField: string; operation: number; comparisonField: { type: string; value: any } }) => {
          if (searchString.length !== 0) searchString += ",";
          if (r.comparisonField.type === "Input") {
            searchString += constructQuery(r.schemaField, r.operation, JSON.stringify(params[r.comparisonField.value]));
          } else if (r.comparisonField.type === 'Context') {
            let context: any = call.request.context;
            for (const key of r.comparisonField.value.split('.')) {
              if (context.hasOwnProperty(key)) {
                context = context[key];
              }
            }
            searchString += constructQuery(r.schemaField, r.operation, JSON.stringify(context));
          } else {
            searchString += constructQuery(r.schemaField, r.operation, JSON.stringify(r.comparisonField.value));
          }
        }
      );
    }

    if (endpoint.operation === 1 || endpoint.operation === 2) {
      endpoint.assignments!.forEach((r: { schemaField: string; action: number; assignmentField: { type: string; value: any } }) => {
        if (createString.length !== 0) createString += ",";
        if (r.assignmentField.type === "Input") {
          createString += constructAssignment(r.schemaField, r.action, JSON.stringify(params[r.assignmentField.value]));
        } else if (r.assignmentField.type === 'Context') {
          let context: any = call.request.context;
          for (const key of r.assignmentField.value.split('.')) {
            if (context.hasOwnProperty(key)) {
              context = context[key];
            }
          }
          searchString += constructAssignment(r.schemaField, r.action, JSON.stringify(context));
        } else {
          createString += constructAssignment(r.schemaField, r.action, JSON.stringify(r.assignmentField.value));
        }
      });
    }

    searchString = "{" + searchString + "}";
    createString = "{" + createString + "}";
    let promise;
    if (endpoint.operation === 0) {
      promise = this.grpcSdk.databaseProvider!.findMany(endpoint.selectedSchemaName, JSON.parse(searchString));
    } else if (endpoint.operation === 1) {
      promise = this.grpcSdk.databaseProvider!.create(endpoint.selectedSchemaName, JSON.parse(createString));
    } else if (endpoint.operation === 2) {
      promise = this.grpcSdk.databaseProvider!.updateMany(
        endpoint.selectedSchemaName,
        JSON.parse(searchString),
        JSON.parse(createString)
      );
    } else if (endpoint.operation === 3) {
      promise = this.grpcSdk.databaseProvider!.deleteMany(endpoint.selectedSchemaName, JSON.parse(searchString));
    } else {
      console.error("Niko eisai malakas");
      process.exit(-1);
    }

    promise
      .then((r: any) => {
        if (endpoint.operation === 1) {
          r = [r];
        } else if (endpoint.operation === 2) {
          // find a way to return updated documents
          r = ["Ok"];
        }
        callback(null, { result: JSON.stringify({ result: r }) });
      })
      .catch((err: any) => {
        callback({ code: grpc.status.INTERNAL, message: err.message });
      });
  }
}
