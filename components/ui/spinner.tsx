export const LoadingSpinner = ({ message }: { message: string }) => {
  return (
    <div className="flex justify-center items-center mt-4">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      <p className="mt-4 text-sm text-muted-foreground">{message}</p>
    </div>
  );
};
