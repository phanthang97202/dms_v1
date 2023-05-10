import { AuthState } from "@/types";
import { atom } from "jotai";
import {atomsWithQuery} from "jotai-tanstack-query";
import {ccsApi, createClientGateApi, useClientgateApi} from "@packages/api";
import {useAuth} from "@packages/contexts/auth";
import {logger} from "@packages/logger";

const atomWithLocalStorage = <T,>(key: string, initialValue: T) => {
  const getInitialValue = () => {
    const item = localStorage.getItem(key);
    if (item !== null) {
      return JSON.parse(item);
    }
    return initialValue;
  };
  const baseAtom = atom(getInitialValue());
  return atom(
    (get) => get(baseAtom),
    (get, set, update) => {
      const nextValue =
        typeof update === 'function' ? update(get(baseAtom)) : update;
      set(baseAtom, nextValue);
      localStorage.setItem(key, JSON.stringify(nextValue));
    }
  );
};

const emptyState: AuthState = {
  token: localStorage.getItem("token") || undefined,
  networkId: localStorage.getItem("networkId") || '0',
  clientGateUrl: localStorage.getItem("clientGateUrl") || undefined,
  currentUser: undefined,
  clientGate: undefined,
  permissions: undefined,
};
export const authAtom = atomWithLocalStorage<AuthState>('auth', emptyState);
export const loggedInAtom = atom((get) => {
  return !!get(authAtom).token;
});

const [permissionAtom] = atomsWithQuery((get) => ({
  queryKey: ['permissions'],
  queryFn: async ({ }) => {
    const auth = get(authAtom);
    logger.debug('auth:', auth)
    if(auth) {
      const { currentUser, networkId, orgData, clientGateUrl } = auth;
      if(!currentUser) {
        return {}
      }
      const api = createClientGateApi(
        currentUser!,
        clientGateUrl!,
        networkId,
        orgData?.Id!
      )
      const res = await api.getUserPermissions();
      if (res.isSuccess) {
        return res.Data
      } else {
        return {};
      }
    } 
    return {};
  },
  keepPreviousData: false,
}));

export {
  permissionAtom
}