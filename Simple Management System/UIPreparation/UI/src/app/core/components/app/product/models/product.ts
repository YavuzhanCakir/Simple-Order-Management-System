﻿export class Product{
   
    id?:number; 
    createdUserId?:number; 
    createdDate?:(Date | any); 
    lastUpdatedUserId?:number; 
    lastUpdatedDate?:(Date | any); 
    status:boolean; 
    isDeleted:boolean; 
    name?:string; 
    colorId?:number; 
    size?:string;
}