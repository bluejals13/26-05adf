// components/loading/UserCardSkeleton.tsx	카드 대기창

export function UserCardSkeleton() {
  return (
    <div className="card-skeleton">
      <div className="avatar-skeleton" />
      <div className="text-skeleton">
        <div className="line short" />
        <div className="line long" />
      </div>
    </div>
  );
}