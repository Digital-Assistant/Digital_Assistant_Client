/**
 * SweetAlert2 Mock
 * 
 * This mock provides a minimal implementation of SweetAlert2 for testing.
 * It prevents actual modal dialogs from appearing during tests and allows
 * you to assert that alerts were triggered with the correct parameters.
 * 
 * @example
 * ```typescript
 * import Swal from 'sweetalert2';
 * 
 * // In your test:
 * Swal.fire({ title: 'Success!' });
 * expect(Swal.fire).toHaveBeenCalledWith({ title: 'Success!' });
 * ```
 */

const Swal = {
    /**
     * Create a SweetAlert2 instance with custom configuration
     * @returns A mock instance with a fire method
     */
    mixin: jest.fn(() => ({
        fire: jest.fn(),
    })),

    /**
     * Display a modal dialog
     * @returns A mock promise that resolves immediately
     */
    fire: jest.fn(),
};

export default Swal;
