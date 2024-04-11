export interface IComission {
    id: string;
    title: string;
    percentage: string;
}

export const dummyComissionList: IComission[] = [{
    id: new Date().toJSON().toString(),
    title: "erick",
    percentage: "0.3"
},
];