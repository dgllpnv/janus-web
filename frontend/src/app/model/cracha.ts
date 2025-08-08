export interface Cracha {
    id       : string;
    matricula: string;
    cargo: string;
    nomeCracha: string;
    nomeCompleto: string;
    dataSolicitacao: Date;
    dataEntrega: Date;
	dataimpressao: Date;
	titulo: string;
    foto: Blob;
}