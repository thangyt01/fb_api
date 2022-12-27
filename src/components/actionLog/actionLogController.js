import { migrateUsersFromDbToEs } from "../../../database/elasticSearch/migration";
import { HTTP_STATUS } from "../../helpers/code";
import { respondItemSuccess, respondWithError } from "../../helpers/messageResponse";
import { ActionLogService } from "./actionLogService";

export class ActionLogController {
    static async updateFirebaseToken(req, res) {
        try {
            const params = {
                userId: req.id,
                deviceId: req.deviceId,
                firebaseToken: req.body ? req.body.firebase_token : null
            }
            const result = await ActionLogService.updateFirebaseToken(params)
            if (result.success) {
                res.json(respondItemSuccess(result.data))
            } else {
                res.json(respondWithError(result.code, result.message, result.data))
            }
        } catch (error) {
            res.json(respondWithError(HTTP_STATUS[1013].code, error.message, error))
        }
    }

    static async migrateUsersDbToElasticSearch(req, res) {
        try {
            const rs = await migrateUsersFromDbToEs()
            if (rs) {
                res.json(respondItemSuccess('migrate done!!!'))
            } else {
                res.json(respondWithError())
            }
        } catch (error) {
            res.json(respondWithError(HTTP_STATUS[1013].code, error.message, error))
        }
    }
}