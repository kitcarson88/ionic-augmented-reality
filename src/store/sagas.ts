//import { select, call, put, takeEvery, takeLatest, take, all } from 'redux-saga/effects';

//const getCurrentScan = state => state.scan.currentScan;

/*function* nfcDataError() {
    console.log("Registering saga nfcDataError on scan/ERROR_SCAN");
    yield takeEvery("ERROR_SCAN", function*() {
        let action = {
            type: 'SET_CERTIFICATION_STATE',
            payload: CertificationType.TAG_ERROR
        };
        yield put(action);
    });
}

function* nfcInfosError()
{
    console.log("Registering saga nfcInfosError on filiera/RETRIEVE_NFC_INFOS_ERROR");

    yield takeEvery("RETRIEVE_NFC_INFOS_ERROR", function*() {
        let action = {
            type: 'SET_CERTIFICATION_STATE',
            payload: CertificationType.VALIDATION_SERVICES_UNREACHABLE
        };
        yield put(action);
    });
}

function* nfcInfosSuccess()
{
    console.log("Registering saga nfcInfosSuccess on filiera/RETRIEVE_NFC_INFOS_COMPLETED");

    yield takeEvery("RETRIEVE_NFC_INFOS_COMPLETED", function*() {
        const currentScan: NfcData = yield select(getCurrentScan);
        const nfcInfos: NfcInfosDTO = yield select(getNfcInfos);

        let tagUidValid: boolean;
        if (currentScan.tagId)  //In Android tipically populated. We use it to verify tag validity
        {
            tagUidValid = false;

            for (let uid of nfcInfos.dati_NFC.identificativi_NFC)
                if (currentScan.tagId.toUpperCase() === uid.uuid_tag.toUpperCase())
                    tagUidValid = true;
        }
        else    //In iOS tagId can't be read, and this check is avoided
            tagUidValid = true;
        
        if (!tagUidValid || !(nfcInfos.identificativo_della_partita))
        {
            let action = {
                type: 'SET_CERTIFICATION_STATE',
                payload: CertificationType.NOT_VERIFIED
            };
            yield put(action);
            return;
        }

        let url = environment.mock? '../../assets/mock-data/filiera-infos.json' : environment.baseUrl + environment.apiVersion + constants.filieraInfosEndpoint;
        let dto = new FilieraRequestDTO();
        dto.group = "true";
        dto.search_param = nfcInfos.identificativo_della_partita;

        //Create redux-offline action to launch
        let filieraRequestAction = {
            type: 'RETRIEVE_TRACCIATURA_FILIERA',
            meta: {
                offline: {
                    effect: { url: url, method: 'POST', json: { body: dto } },
                    commit: { type: 'RETRIEVE_TRACCIATURA_FILIERA_COMPLETED' },
                    rollback: { type: 'RETRIEVE_TRACCIATURA_FILIERA_ERROR' },
                }
            }
        };
        yield put(filieraRequestAction);
    });
}

function* filieraInfosError()
{
    console.log("Registering saga filieraInfosError on filiera/RETRIEVE_TRACCIATURA_FILIERA_ERROR");

    yield takeEvery("RETRIEVE_TRACCIATURA_FILIERA_ERROR", function*() {
        const filieraInfosError: NfcData = yield select(getFilieraInfos);
    
        let action;
        if (filieraInfosError && filieraInfosError['status'] === 404)
        {
            action = {
                type: 'SET_CERTIFICATION_STATE',
                payload: CertificationType.NOT_VERIFIED
            };
        }
        else
        {
            action = {
                type: 'SET_CERTIFICATION_STATE',
                payload: CertificationType.VALIDATION_SERVICES_UNREACHABLE
            };
        }
        yield put(action);
    });
}

function* filieraInfosSuccess()
{
    console.log("Registering saga filieraInfosSuccess on filiera/RETRIEVE_TRACCIATURA_FILIERA_COMPLETED");

    yield takeEvery("RETRIEVE_TRACCIATURA_FILIERA_COMPLETED", function*() {
        let action = {
            type: 'SET_CERTIFICATION_STATE',
            payload: CertificationType.VERIFIED
        };
        yield put(action);
    });
}

function* resetScanData()
{
    console.log("Registering saga resetScanData on scan/LOADING");

    yield takeEvery("RESET_CERTIFICATION_STATE", function*() {
        yield put({ type: 'RESET_FILIERA_DATA' });
    });
}

export default function* rootSaga() {
    yield all([
        nfcDataError(),
        nfcInfosError(),
        nfcInfosSuccess(),
        filieraInfosError(),
        filieraInfosSuccess(),
        resetScanData()
    ])
}*/