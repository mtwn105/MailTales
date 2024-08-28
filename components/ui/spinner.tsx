export const LoadingSpinner = ({ message }: { message: string }) => {
  return (
    <div className="flex flex-col items-center">
      <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent"></div>
      {message && (
        <p className="mt-2 text-lg text-muted-foreground">{message}</p>
      )}
    </div>
  );
};
