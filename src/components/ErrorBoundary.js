// src/components/ErrorBoundary.js
import React from 'react';

export default class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('Component Error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return <div className="error">Calculator failed to load</div>;
    }
    return this.props.children;
  }
}