const DashboardSkeleton = () => {
  return (
    <div className="space-y-8 ">
      <div className="animate-pulse space-y-6">
        <div className="h-16 rounded-3xl bg-muted" />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <div className="h-28 rounded-2xl bg-muted" />
          <div className="h-28 rounded-2xl bg-muted" />
          <div className="h-28 rounded-2xl bg-muted" />
        </div>
        <div className="h-32 rounded-2xl bg-muted" />
      </div>
    </div>
  );
};

export default DashboardSkeleton;
