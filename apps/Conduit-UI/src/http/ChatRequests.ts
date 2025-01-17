import axios from 'axios';
import { CONDUIT_API } from './requestsConfig';
import { IChatConfig } from '../models/chat/ChatModels';

export const getChatConfig = () => axios.get(`${CONDUIT_API}/admin/config/chat`);

export const putChatConfig = (params: IChatConfig) =>
  axios.put(`${CONDUIT_API}/admin/config/chat`, {
    config: { ...params },
  });

export const createChatRoom = (params: { name: string; participants: string[] }) =>
  axios.post(`${CONDUIT_API}/admin/chat/room`, {
    ...params,
  });

export const getChatRooms = (params: { skip: number; limit: number; search?: string }) =>
  axios.get(`${CONDUIT_API}/admin/chat/rooms`, {
    params: {
      populate: 'participants',
      ...params,
    },
  });

export const getChatMessages = (params: {
  skip: number;
  limit: number;
  senderId?: string;
  roomId?: string;
}) =>
  axios.get(`${CONDUIT_API}/admin/chat/messages`, {
    params: {
      populate: 'senderUser',
      ...params,
    },
  });

export const deleteChatRooms = (params: { ids: string[] }) =>
  axios.delete(`${CONDUIT_API}/admin/chat/rooms`, { params: { ...params.ids } });

export const deleteChatMessages = (params: { ids: string[] }) =>
  axios.delete(`${CONDUIT_API}/admin/chat/messages`, { params: { ...params.ids } });
