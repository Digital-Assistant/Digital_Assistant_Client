import {UDAStorageService} from "../services/UDAStorageService";

describe('UDAStorageService', () => {
    describe('add', () => {
        it('should add data to the storage', async () => {
            // Arrange
            const data = { name: 'John Doe' };
            const key = 'user';
            const storageData = JSON.stringify(data);

            // Act
            await UDAStorageService.add(data, key);

            // Assert
            // Add your assertions here to verify the expected behavior of the function
            // For example, you can check if the data is stored in the storage
            // and if the correct key is used to store the data
            expect(window.localStorage.getItem(key)).toEqual(storageData);
        });
    });
});
