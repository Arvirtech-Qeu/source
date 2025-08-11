import React, { Component, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Alert, AlertDescription } from '@components/Alert';
import { Button } from '@components/Button';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
}

class ErrorBoundary extends Component<Props, ErrorBoundaryState> {
    constructor(props: Props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
        };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return {
            hasError: true,
            error,
        };
    }

    componentDidCatch(error: Error, info: React.ErrorInfo): void {
        console.error("Error caught in Error Boundary:", error, info);
        // You could add error reporting service here
    }

    handleReset = () => {
        this.setState({
            hasError: false,
            error: null,
        });
    };

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="min-h-[200px] flex items-center justify-center p-6">
                    <Alert variant="destructive" className="max-w-lg bg-red-50 border-red-200">
                        <AlertTriangle className="h-5 w-5 text-color" />
                        {/* <AlertTitle className="text-red-800 text-lg font-semibold mb-2"> */}
                        Oops! Something went wrong
                        {/* </AlertTitle> */}
                        <AlertDescription className="text-red-700 mb-4">
                            {this.state.error?.message || 'An unexpected error occurred. Please try again.'}
                        </AlertDescription>
                        <div className="flex justify-end mt-4">
                            <Button
                                onClick={this.handleReset}
                                className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
                            >
                                <RefreshCw className="h-4 w-4" />
                                Try Again
                            </Button>
                        </div>
                    </Alert>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;