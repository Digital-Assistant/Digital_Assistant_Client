import { UDAStorageService } from './UDAStorageService';

describe('UDAStorageService', () => {
    describe('add', () => {
        it('should add data to the storage', async () => {
            // Arrange
            const data = { name: 'John Doe' };
            const key = 'user';

            // Act
            await UDAStorageService.add(data, key);

            // Assert
            // Add your assertions here to verify the expected behavior of the function
            // For example, you can check if the data is stored in the storage
            // and if the correct key is used to store the data

        });
    });
});
