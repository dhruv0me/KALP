import { IconArrowLeft, IconShieldCheck } from "@tabler/icons-react";
import { useEffect } from "react";
import {
  Link,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router";
import {
  CampaignMemberWorkspace,
  isProtectedIntentKey,
  type ProtectedIntentKey,
} from "@/components/campaigns/CampaignMemberWorkspace";
import { EmptyState } from "@/components/common/EmptyState";
import { Skeleton } from "@/components/ui/skeleton";
import { useCampaign } from "@/hooks/use-campaigns";
import { useSession } from "@/hooks/use-session";

export function meta() {
  return [{ title: "kalpa" }];
}

export default function MemberCampaignActionRoute() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { pathname, search } = useLocation();
  const [searchParams] = useSearchParams();
  const rawIntent = searchParams.get("intent");
  const initialIntent: ProtectedIntentKey = isProtectedIntentKey(rawIntent)
    ? rawIntent
    : "donate";

  const { authenticated, email, isLoading: sessionLoading } = useSession();
  const { campaign, isLoading, isError, refetch } = useCampaign(id);

  useEffect(() => {
    if (!sessionLoading && !authenticated) {
      navigate(`/auth?return=${encodeURIComponent(pathname + search)}`, {
        replace: true,
      });
    }
  }, [authenticated, navigate, pathname, search, sessionLoading]);

  const handleGuestRequireAuth = (intentKey: ProtectedIntentKey) => {
    if (!id) return;
    const targetPath = `/member/campaigns/${encodeURIComponent(id)}?intent=${encodeURIComponent(intentKey)}`;
    navigate(`/auth?return=${encodeURIComponent(targetPath)}`);
  };

  return (
    <main className="explore-page">
      <Link
        className="text-link back-inline-link"
        to={id ? `/campaigns/${encodeURIComponent(id)}` : "/explore"}
      >
        <IconArrowLeft size={16} aria-hidden="true" /> Back to campaign
      </Link>

      <div className="campaign-detail">
        <div className="eyebrow">
          <span className="eyebrow-dot" />
          AUTHENTICATED ACCESS{email ? ` · ${email}` : ""}
        </div>

        {sessionLoading || isLoading ? (
          <div className="space-y-4 mt-6" aria-busy="true">
            <Skeleton className="h-10 w-2/3 bg-[#e6eee1]" />
            <Skeleton className="h-24 w-full bg-[#e6eee1]" />
          </div>
        ) : isError ? (
          <div className="empty-state" role="alert">
            <h2>We couldn&apos;t load this campaign.</h2>
            <p>Please try again in a moment.</p>
            <button
              type="button"
              className="text-link"
              onClick={() => void refetch()}
            >
              Try again
            </button>
          </div>
        ) : !campaign ? (
          <EmptyState
            message="Campaign not found."
            description="It may have been removed or is not publicly available."
            actionLabel="Explore all campaigns"
            onAction={() => navigate("/explore")}
          />
        ) : (
          <>
            <h1>{campaign.title}</h1>
            <p className="member-campaign-ref inline-flex items-center gap-2">
              <IconShieldCheck size={17} aria-hidden="true" />
              <span>
                {campaign.category} · {campaign.country} ·{" "}
                <strong>{campaign.status}</strong>
              </span>
            </p>

            <CampaignMemberWorkspace
              campaign={campaign}
              authenticated={authenticated}
              initialIntent={initialIntent}
              onGuestRequireAuth={handleGuestRequireAuth}
            />
          </>
        )}
      </div>
    </main>
  );
}
