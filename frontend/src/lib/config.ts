interface appConfigInterface {
    projectEndpoint: string;
    revalidateTime: number;
}

export const appConfig: appConfigInterface = {
    projectEndpoint: "projects",
    revalidateTime: 86400, // 24 часа
};