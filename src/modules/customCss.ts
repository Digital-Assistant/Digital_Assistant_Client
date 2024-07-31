export const UDACustomCss = {
  src: "",
  loaded: false,
  /**
   * Sets the URL for the custom CSS and dispatches a "UDALoadCustomCSS" event if the URL is not null, undefined, or empty.
   *
   * @param val - The new URL for the custom CSS, or null/undefined to clear the URL.
   * @throws {Error} If the `val` parameter is not a string, null, or undefined.
   */
  set url(val: string | null | undefined) {
    try {
      if (typeof val !== "string" && val !== null && val !== undefined) {
        throw new Error(
          "Invalid URL type. Expected string, null, or undefined."
        );
      }

      this.src = val;

      if (val) {
        // Only dispatch event and set loaded to true if val is not null/undefined/empty
        document.dispatchEvent(
          new CustomEvent("UDALoadCustomCSS", {
            detail: { data: "UDALoadCustomCSS" },
            bubbles: false,
            cancelable: false,
          })
        );
        this.loaded = true;
      } else {
        this.loaded = false;
      }
    } catch (error) {
      console.error("Error setting UDACustomCss URL:", error);
      this.src = "";
      this.loaded = false;
    }
  },
  get url() {
    return this.src;
  },
};
