import { HTTP_STATUS } from "../../helpers/code";
import { respondItemSuccess, respondWithError } from "../../helpers/messageResponse";
import { EmotionService } from "./emotionService";

export class EmotionController {
    static async set(req, res) {
        try {
            const params = {
                instance_id: req.body ? req.body.instance_id : null,
                type: req.body ? req.body.type : null,
                emotion_type: req.body ? req.body.emotion_type : null,
                loginUser: req.loginUser,
            }
            const result = await EmotionService.set(params)
            if (result.success) {
                res.json(respondItemSuccess(result.data))
            } else {
                res.json(respondWithError(result.code, result.message, result.data))
            }
        } catch (error) {
            res.json(respondWithError(HTTP_STATUS[1013].code, error.message, error))
        }
    }
}