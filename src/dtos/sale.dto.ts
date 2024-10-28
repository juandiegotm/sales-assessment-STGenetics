export interface SaleDTO {
    customerId: number;
}


export interface CreateSaleLineDTO {
    saleId: number;     // ID de la venta
    itemId: number;     // ID del artículo
    quantity: number;   // Cantidad del artículo
    discount?: number;  // Descuento (opcional)
}

export interface UpdateSaleLineDTO {
    quantity: number;   // Cantidad del artículo
    discount: number;  // Descuento (opcional)
}