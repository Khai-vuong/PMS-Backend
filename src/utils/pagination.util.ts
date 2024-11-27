import { NotFoundException } from "@nestjs/common";

export async function paginate(list: any[], page: string, pageSize: string){
    const perPage = parseInt(pageSize);
    const pagenum = parseInt(page);
    const start = (pagenum - 1) * perPage;
    const end = start + perPage;
    let data = [];
    if (start > list.length - 1) {
        throw new NotFoundException("Invalid page number");
    }
    if (end > list.length) {
        data = list.slice(start, list.length);
    }
    else {
        data = list.slice(start, end);
    }
    if (data.length === 0) {
        throw new NotFoundException("Nothing found in this page");
    }
    return {data,perPage,pagenum};
}