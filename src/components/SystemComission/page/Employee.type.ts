export interface IEmployee {
    id: string;
    title: string;
    percentage: string;
}

export const dummyEmployeedList: IEmployee[] = [{
    id: new Date().toJSON().toString(),
    title: "erick",
    percentage: "0.3"
},
];