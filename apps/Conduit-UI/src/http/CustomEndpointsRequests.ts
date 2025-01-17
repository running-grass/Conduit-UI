import axios from 'axios';
import { Pagination, Search } from '../models/http/HttpModels';
import { CONDUIT_API } from './requestsConfig';

export const getCustomEndpointsRequest = (
  params: Pagination & Search & { schemaName?: string[] } & { operation?: number }
) => {
  return axios.get(`${CONDUIT_API}/admin/database/customEndpoints`, { params });
};
export const editCustomEndpointsRequest = (_id: string, endpointData: any) => {
  return axios.patch(`${CONDUIT_API}/admin/database/customEndpoints/${_id}`, endpointData);
};
export const deleteCustomEndpointsRequest = (_id: string) => {
  return axios.delete(`${CONDUIT_API}/admin/database/customEndpoints/${_id}`);
};
export const createCustomEndpointsRequest = (endpointData: any) => {
  return axios.post(`${CONDUIT_API}/admin/database/customEndpoints`, endpointData);
};

export const getSchemasWithEndpoints = () => {
  return axios.get(`${CONDUIT_API}/admin/database/customEndpoints/schemas`);
};
