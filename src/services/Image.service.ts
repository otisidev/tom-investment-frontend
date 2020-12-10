import axios from "axios";
import { UploadPreset, AppUploadUrl } from "../context/App";

class ImageService {
    /**
     * Upload a single
     * @param id user id
     * @param file File to upload
     */
    async Upload(file: File) {
        if (file) {
            let fd = new FormData();
            fd.append("file", file);
            fd.append("upload_preset", UploadPreset());
            // Fetch
            const result = await axios({
                url: AppUploadUrl(),
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                data: fd,
            });
            if (result.status === 200) return result.data.secure_url;
        }
        throw new Error("File or/and identifier not found!");
    }
}
export const imageService = new ImageService();

// const handleUpload = (event: any) => {};
