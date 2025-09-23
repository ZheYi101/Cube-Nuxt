import { useStorage } from "@vueuse/core"
import { API_KEY_STORAGE_KEY } from "~/assets/constant"

export const useApiKey = () => {
    const apiKey = useStorage<string>(
        API_KEY_STORAGE_KEY,
        '',
        undefined,
        { initOnMounted: true },
    )

    return apiKey
}