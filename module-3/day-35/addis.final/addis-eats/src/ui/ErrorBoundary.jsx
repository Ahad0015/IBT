import { Component } from "react";

// Day 34. An error boundary must be a class: only classes have
// getDerivedStateFromError / componentDidCatch.
// It catches errors thrown while RENDERING its children (and failed lazy
// chunk loads). It never sees event handlers or async code - those need
// their own try/catch (see Checkout.handleSubmit).
//
// The parent resets it by giving it a new `key` (Layout uses the pathname),
// so navigating away throws the old error state out and the header and nav
// stay usable the whole time.
export default class ErrorBoundary extends Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    // One place to report to a real service later (Module 4+).
    console.error("Caught by ErrorBoundary:", error, info.componentStack);
  }

  render() {
    if (this.state.error) {
      return (
        <section className="panel" role="alert">
          <h2>Something went wrong on this page</h2>
          <p>The rest of Addis Eats still works. You can try again or head back to the menu.</p>
          <button type="button" onClick={() => this.setState({ error: null })}>
            Try again
          </button>
        </section>
      );
    }
    return this.props.children;
  }
}
