import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { removeCookie, setCookie } from '../../utils/cookie';
import { IModule } from '../../models/appAuth';
import { clearNotificationPageStore } from './notificationsSlice';
import { clearStoragePageStore } from './storageSlice';
import { getAdminModulesRequest } from '../../http/SettingsRequests';
import { loginRequest } from '../../http/AppAuthRequests';
import { clearAppNotifications, setAppLoading } from './appSlice';
import { getErrorData } from '../../utils/error-handler';
import { clearEmailPageStore } from './emailsSlice';
import { clearAuthenticationPageStore } from './authenticationSlice';
import { enqueueErrorNotification, enqueueInfoNotification } from '../../utils/useNotifier';
import { getDisabledModules, getSortedModules } from '../../utils/modules';

export type AppAuthState = {
  data: {
    token: string;
    enabledModules: IModule[];
    disabledModules: IModule[];
  };
};

const initialState: AppAuthState = {
  data: {
    token: '',
    enabledModules: [],
    disabledModules: [],
  },
};

export const asyncLogin = createAsyncThunk(
  'appAuth/login',
  async (values: { username: string; password: string; remember: boolean }, thunkAPI) => {
    thunkAPI.dispatch(setAppLoading(true));
    try {
      const username = values.username;
      const password = values.password;
      const { data } = await loginRequest(username, password);
      thunkAPI.dispatch(enqueueInfoNotification(`Welcome ${username}!`));
      thunkAPI.dispatch(setAppLoading(false));
      return { data, cookie: values.remember };
    } catch (error) {
      thunkAPI.dispatch(
        enqueueErrorNotification(`Could not login! error msg:${getErrorData(error)}`)
      );
      thunkAPI.dispatch(setAppLoading(false));
      throw error;
    }
  }
);

export const asyncLogout = createAsyncThunk('appAuth/logout', async (arg: void, thunkAPI) => {
  thunkAPI.dispatch(clearAuthenticationPageStore());
  thunkAPI.dispatch(clearEmailPageStore());
  thunkAPI.dispatch(clearNotificationPageStore());
  thunkAPI.dispatch(clearStoragePageStore());
  thunkAPI.dispatch(clearAppNotifications());
});

export const asyncGetAdminModules = createAsyncThunk(
  'appAuth/getModules',
  async (arg, thunkAPI) => {
    thunkAPI.dispatch(setAppLoading(true));
    try {
      const { data } = await getAdminModulesRequest();
      thunkAPI.dispatch(setAppLoading(false));
      return data;
    } catch (error) {
      thunkAPI.dispatch(setAppLoading(false));
      thunkAPI.dispatch(enqueueErrorNotification(`${getErrorData(error)}`));
      throw error;
    }
  }
);

const appAuthSlice = createSlice({
  name: 'appAuth',
  initialState,
  reducers: {
    setToken: (state, action) => {
      state.data.token = action.payload.token;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(asyncLogin.fulfilled, (state, action) => {
      setCookie('JWT', action.payload.data.token, action.payload.cookie);
      state.data.token = action.payload.data.token;
    });
    builder.addCase(asyncGetAdminModules.fulfilled, (state, action) => {
      const sortedModules = getSortedModules(action.payload.modules);
      state.data.enabledModules = sortedModules;
      const payloadModules = sortedModules.map((module: IModule) => module.moduleName);
      state.data.disabledModules = getDisabledModules(payloadModules);
    });
    builder.addCase(asyncLogout.fulfilled, (state) => {
      removeCookie('JWT');
      state.data.token = '';
      state.data.enabledModules = [];
      state.data.disabledModules = [];
    });
  },
});

export const { setToken } = appAuthSlice.actions;

export default appAuthSlice.reducer;
