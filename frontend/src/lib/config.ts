interface appConfigInterface {
    apiBaseUrl: string;
    projectEndpoint: string;
    revalidateTime: number;
}

export const appConfig: appConfigInterface = {
    apiBaseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api",
    projectEndpoint: "projects",
    revalidateTime: 86400, // 24 часа
};