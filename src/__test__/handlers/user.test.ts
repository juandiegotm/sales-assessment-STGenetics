import { getCustomers } from "../../handlers/customer.handler";

import { mockRequest, mockResponse } from "../../__mocks__";

describe('getCustomers', () => {
    it('should return a list of customers', () => {
        getCustomers(mockRequest, mockResponse);
        expect(mockResponse.send).toHaveBeenCalledWith([]);
    });
});