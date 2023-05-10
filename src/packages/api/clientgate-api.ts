import { useMstPortTypeAPI } from "./clientgate/Mst_PortType-api";
import { useMstPort } from "./clientgate/MstPort-api";
import axios, { AxiosError } from "axios";
import { Tid } from "@/utils/hash";
import { IUser } from "@packages/types";
import { useAuth } from "../contexts/auth";
import { useProvinceApi } from "./clientgate/province-api";
import { useDealerApi } from "./clientgate/dealer-api";
import { useMst_DealerType } from "./clientgate/Mst_DealerType-api";
import { useMst_District } from "./clientgate/Mst_District-api";
import { useUserApi } from "@packages/api/clientgate/user-api";
import { useDistrictApi } from "./clientgate/district-api";
import { usePaymentApi } from "./clientgate/MstPayment-api";
import { usePortApi } from "./clientgate/Mst_Port-api";
import { usePortsApi } from "./clientgate/Mst_Ports-api";
import { useAreaApi } from "./clientgate/Mst_Area-api";
import { useCarModelApi } from "./clientgate/Mst_CarModel-api";
import { useTransporterDriverApi } from "./clientgate/Mst_TransporterDriver-api";
import { useUnitPriceGPSApi } from "./clientgate/Mst_UnitPriceGPS-api";
import { useInsuranceTypeApi } from "./clientgate/Mst_InsuranceType-api";
import { usePointRegisApi } from "./clientgate/Mst_PointRegis-api";
import { useDirCAApi } from "./clientgate/Mst_DirCA-api";
import { useCabinCertificateApi } from "./clientgate/Mst_CabinCertificate-api";
import { useMngQuotaApi } from "./clientgate/Mst_MngQuota-api";
import { useAmplitudeApprOrdApi } from "./clientgate/Mst_AmplitudeApprOrd-api";

/**
 * Creates an axios instance for making requests to the ClientGate API.
 *
 * @param {IUser} currentUser - The current user's information.
 * @param {string} clientGateDomain - The base URL for the ClientGate API.
 * @param {string} networkId - The ID of the network.
 * @param {string} orgId - The ID of the organization.
 * @return {AxiosInstance} An axios instance configured for the ClientGate API.
 */
export const createClientGateApiBase = (
  currentUser: IUser,
  clientGateDomain: string,
  networkId: string,
  orgId: string
) => {
  const api = axios.create({
    baseURL: clientGateDomain,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "application/x-www-form-urlencoded",
      AppAgent: import.meta.env.VITE_AGENT,
      GwUserCode: import.meta.env.VITE_GW_USER,
      GwPassword: import.meta.env.VITE_GW_USER_PW,
      AppVerCode: "V1",
      Tid: Tid(),
      AppTid: Tid(),
      AppLanguageCode: currentUser.Language,
      UtcOffset: currentUser.TimeZone,
      NetworkId: networkId,
      OrgId: orgId,
    },
  });
  api.interceptors.response.use(
    function (response) {
      // with this API, it always falls to this case.
      // console.log("success case", response);
      const data = response.data;
      const result: any = {
        isSuccess: data.Data._strErrCode === "0" && !data.Data._excResult,
        debugInfo: data.Data._dicDebugInfo,
        errorInfo:
          data.Data._strErrCode === "0" ? undefined : data.Data._excResult,
        errorCode: data.Data._strErrCode,
      };
      if (
        result.isSuccess &&
        !!data.Data._objResult &&
        !!data.Data._objResult.DataList
      ) {
        result.DataList = data.Data._objResult.DataList;
        result.ItemCount = data.Data._objResult.ItemCount;
        result.PageCount = data.Data._objResult.PageCount;
        result.PageIndex = data.Data._objResult.PageIndex;
        result.PageSize = data.Data._objResult.PageSize;
      } else {
        result.Data = data.Data._objResult;
      }
      return result;
    },
    function (error: AxiosError) {
      if (error?.response?.status === 401) {
        location.href = "/login";
      }
      return Promise.reject(error.response?.data);
    }
  );
  return api;
};

export const createClientGateApi = (
  currentUser: IUser,
  clientgateDomain: string,
  networkId: string,
  orgId: string
) => {
  const apiBase = createClientGateApiBase(
    currentUser,
    clientgateDomain,
    networkId,
    orgId
  );
  const provinceApis = useProvinceApi(apiBase);
  const dealerApis = useDealerApi(apiBase);
  const mstPort = useMstPort(apiBase);
  const mstPortType = useMstPortTypeAPI(apiBase);
  const mstDealerType = useMst_DealerType(apiBase);
  const mstDistrict = useMst_District(apiBase);
  const userApis = useUserApi(apiBase);
  const districtApis = useDistrictApi(apiBase);
  const paymentApis = usePaymentApi(apiBase);
  const portApis = usePortApi(apiBase);
  const portsApis = usePortsApi(apiBase);
  const areaApis = useAreaApi(apiBase);
  const carModelApis = useCarModelApi(apiBase);
  const transporterDriver = useTransporterDriverApi(apiBase);
  const unitPriceGPS = useUnitPriceGPSApi(apiBase);
  const insuranceType = useInsuranceTypeApi(apiBase);
  const pointRegis = usePointRegisApi(apiBase);
  const dirCA = useDirCAApi(apiBase);
  const cabinCertificate = useCabinCertificateApi(apiBase);
  const mngQuota = useMngQuotaApi(apiBase);
  const amplitudeApprOrd = useAmplitudeApprOrdApi(apiBase);

  return {
    ...provinceApis,
    ...dealerApis,
    ...areaApis,
    ...mstPort,
    ...mstPortType,
    ...mstDealerType,
    ...mstDistrict,
    ...userApis,
    ...districtApis,
    ...paymentApis,
    ...portApis,
    ...portsApis,
    ...areaApis,
    ...carModelApis,
    ...transporterDriver,
    ...unitPriceGPS,
    ...insuranceType,
    ...pointRegis,
    ...dirCA,
    ...cabinCertificate,
    ...mngQuota,
    ...amplitudeApprOrd,
  };
};

export const useClientgateApi = () => {
  const {
    auth: { currentUser, networkId, orgData, clientGateUrl },
  } = useAuth();
  return createClientGateApi(
    currentUser!,
    clientGateUrl!,
    networkId,
    orgData?.Id!
  );
};
