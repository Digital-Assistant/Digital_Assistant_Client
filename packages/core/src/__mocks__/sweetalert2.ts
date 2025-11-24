// src/__mocks__/sweetalert2.ts

const Swal = {
    mixin: jest.fn(() => ({
        fire: jest.fn(),
    })),
    fire: jest.fn(),
};

export default Swal;
