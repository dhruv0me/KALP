import { IconArrowLeft, IconShieldCheck } from "@tabler/icons-react";
import { Link, useParams, useSearchParams } from "react-router";
import { Skeleton } from "@/components/ui/skeleton";
import { useCampaign } from "@/hooks/use-campaigns";
import { useSession } from "@/hooks/use-session";

const DEFAULT_INTENT_DETAIL = {
  title: "Make a Donation",
  message:
    "You are signed in and returned to this campaign. Payment gateway and blockchain transaction settlement are not yet connected, so no payment can be submitted yet.",
};

const INTENT_DETAILS: Record<string, { title: string; message: string }> = {
  donate: DEFAULT_INTENT_DETAIL,
  documents: {
    title: "Restricted Documents",
    message:
      "You are signed in. No restricted documents have been uploaded for this campaign yet.",
  },
  proofs: {
    title: "Protected Proofs",
    message:
      "You are signed in. No protected verification proofs have been attached to this campaign yet.",
  },
  contact: {
    title: "Campaign Owner Contact Details",
    message:
      "You are signed in. Campaign owner contact details are not yet published for this campaign.",
  },
  chat: {
    title: "Supporter Group Chat",
    message:
      "You are signed in. Group chat is not yet enabled for this campaign.",
  },
  comments: {
    title: "Campaign Comments",
    message:
      "You are signed in. Comment posting is not yet enabled for this campaign.",
  },
  follow: {
    title: "Save / Follow Campaign",
    message:
      "You are signed in. Campaign saving and following is not yet connected to persistence.",
  },
};

export function meta() {
  return [{ title: "Member Campaign Access — KALP" }];
}

export default function MemberCampaignActionRoute() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const intent = searchParams.get("intent") ?? "donate";
  const detail = INTENT_DETAILS[intent] ?? DEFAULT_INTENT_DETAIL;
  const { campaign, isLoading } = useCampaign(id);
  const { email } = useSession();

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

        {isLoading ? (
          <div className="space-y-4 mt-6" aria-busy="true">
            <Skeleton className="h-10 w-2/3 bg-[#e6eee1]" />
            <Skeleton className="h-24 w-full bg-[#e6eee1]" />
          </div>
        ) : (
          <>
            <h1>{detail.title}</h1>
            {campaign && (
              <p className="member-campaign-ref">
                Campaign: <strong>{campaign.title}</strong> ({campaign.category}{" "}
                · {campaign.country})
              </p>
            )}
            <div className="protected-action-notice" role="status">
              <div className="flex items-center gap-2 mb-2">
                <IconShieldCheck size={18} aria-hidden="true" />
                <strong>Authenticated session verified</strong>
              </div>
              <p>{detail.message}</p>
            </div>
          </>
        )}
      </div>
    </main>
  );
}

