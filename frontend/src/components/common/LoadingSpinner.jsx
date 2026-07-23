import React from 'react';
import { ThreeDots } from 'react-loader-spinner';

const LoadingSpinner = () => {
  return (
    <div className="flex justify-center items-center py-12">
      <ThreeDots
        height="80"
        width="80"
        radius="9"
        color="#2563eb"
        ariaLabel="three-dots-loading"
        visible={true}
      />
    </div>
  );
};

export default LoadingSpinner;