import Swal from 'sweetalert2';
import { addNotification } from '../addNotification';

const mockedSwal = Swal as jest.Mocked<typeof Swal>;

describe('addNotification', () => {
    let shadowHost: HTMLElement;
    let shadowRoot: ShadowRoot;

    beforeEach(() => {
        // Resets the state of all mocks before each test.
        jest.clearAllMocks();

        // Create a mock shadow DOM structure
        shadowHost = document.createElement('div');
        shadowHost.id = 'udan-react-root';
        shadowRoot = shadowHost.attachShadow({ mode: 'open' });
        document.body.appendChild(shadowHost);
    });

    afterEach(() => {
        // Clean up the DOM after each test
        if (shadowHost.parentElement) {
            document.body.removeChild(shadowHost);
        }
    });

    it('should call Swal.mixin with the correct parameters', () => {
        addNotification('Test Title', 'Test Description', 'success', 'top-start');
        expect(mockedSwal.mixin).toHaveBeenCalledWith(expect.objectContaining({
            toast: true,
            position: 'top-start',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            target: expect.any(HTMLElement),
        }));
    });

    it('should call the mixed-in fire method with correct parameters', () => {
        addNotification('Test Title', 'Test Description', 'success', 'top-start');
        
        // Get the object returned by the mixin call from the mock's results
        const toastInstance = (mockedSwal.mixin as jest.Mock).mock.results[0].value;

        // Check that the 'fire' method on that object was called
        expect(toastInstance.fire).toHaveBeenCalledWith({
            icon: 'success',
            title: 'Test Title',
            html: 'Test Description',
        });
    });

    it('should use a container inside the shadow root as the target', () => {
        addNotification();
        const mixinOptions = (mockedSwal.mixin as jest.Mock).mock.calls[0][0];
        const container = mixinOptions.target;
        // Verify the container is the one created inside the shadowRoot
        expect(container).toBe(shadowRoot.querySelector('.udan-notification-container'));
    });

    it('should default to document.body if shadow root is not found', () => {
        // Remove the shadow host to simulate it not being found
        document.body.removeChild(shadowHost);

        addNotification();
        const mixinOptions = (mockedSwal.mixin as jest.Mock).mock.calls[0][0];
        const container = mixinOptions.target;
        expect(container).toBe(document.body);
    });
});
