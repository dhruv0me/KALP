import {
  IconBookmark,
  IconBookmarkFilled,
  IconCheck,
  IconCoin,
  IconExternalLink,
  IconFileCheck,
  IconLock,
  IconMail,
  IconMessageCircle,
  IconMessages,
  IconPlus,
  IconSend,
  IconShieldCheck,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useCampaignMemberData,
  useInitiateDonation,
  usePostCampaignComment,
  useReleaseMilestoneEscrow,
  useSendCampaignChat,
  useToggleCampaignBookmark,
  useUpdateCampaign,
  useVerifyPayment,
} from "@/hooks/use-campaigns";
import { useSession } from "@/hooks/use-session";
import {
  formatCampaignAmount,
  type Campaign,
  type ProtectedProofItem,
  type RestrictedDocumentItem,
} from "@/lib/campaigns";

export type ProtectedIntentKey =
  | "donate"
  | "documents"
  | "proofs"
  | "contact"
  | "chat"
  | "comments"
  | "follow";

export const PROTECTED_ACTIONS: ReadonlyArray<{
  key: ProtectedIntentKey;
  label: string;
}> = [
  { key: "donate", label: "Make a Donation" },
  { key: "documents", label: "View Restricted Documents" },
  { key: "proofs", label: "View Protected Proofs" },
  { key: "contact", label: "Access Owner Contact Details" },
  { key: "chat", label: "Join Group Chat" },
  { key: "comments", label: "Post a Comment" },
  { key: "follow", label: "Save / Follow Campaign" },
];

const ACTION_ICONS: Record<ProtectedIntentKey, typeof IconCoin> = {
  donate: IconCoin,
  documents: IconFileCheck,
  proofs: IconShieldCheck,
  contact: IconMail,
  chat: IconMessages,
  comments: IconMessageCircle,
  follow: IconBookmark,
};

export function isProtectedIntentKey(
  value: string | null | undefined,
): value is ProtectedIntentKey {
  return PROTECTED_ACTIONS.some((item) => item.key === value);
}

interface CampaignMemberWorkspaceProps {
  campaign: Campaign;
  authenticated: boolean;
  initialIntent?: ProtectedIntentKey | null;
  onGuestRequireAuth: (intent: ProtectedIntentKey) => void;
  onCampaignUpdated?: () => void;
}

export function CampaignMemberWorkspace({
  campaign,
  authenticated,
  initialIntent = null,
  onGuestRequireAuth,
  onCampaignUpdated,
}: CampaignMemberWorkspaceProps) {
  const [selectedIntent, setSelectedIntent] =
    useState<ProtectedIntentKey | null>(initialIntent);
  const [commentBody, setCommentBody] = useState("");
  const [chatMessage, setChatMessage] = useState("");
  const [docTitle, setDocTitle] = useState("");
  const [docUrl, setDocUrl] = useState("");
  const [docNote, setDocNote] = useState("");
  const [proofTitle, setProofTitle] = useState("");
  const [proofSummary, setProofSummary] = useState("");
  const [proofUrl, setProofUrl] = useState("");
  const [actionError, setActionError] = useState<string | null>(null);

  // Donation state
  const [donateAmount, setDonateAmount] = useState<number>(500);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [donorPrivacy, setDonorPrivacy] = useState<"public" | "name_only" | "anonymous">("public");
  const [donorDisplayName, setDonorDisplayName] = useState<string>("");
  const [donationSuccess, setDonationSuccess] = useState<{
    amount: number;
    currency: string;
    transactionReference: string;
    blockchainTxHash?: string | undefined;
  } | null>(null);

  // Milestone Escrow Release state
  const [escrowReleaseSuccess, setEscrowReleaseSuccess] = useState<{
    milestoneId: string;
    blockchainTxHash: string;
    releasedAmount: number;
  } | null>(null);

  const { isAdmin } = useSession();
  const initiateDonation = useInitiateDonation();
  const verifyPayment = useVerifyPayment();
  const releaseMilestoneEscrow = useReleaseMilestoneEscrow();

  useEffect(() => {
    if (initialIntent) {
      setSelectedIntent(initialIntent);
    }
  }, [initialIntent]);

  const { memberData, isLoading, isError, refetch } = useCampaignMemberData(
    campaign.id,
    authenticated,
  );

  const toggleBookmark = useToggleCampaignBookmark();
  const postComment = usePostCampaignComment();
  const sendChat = useSendCampaignChat();
  const updateCampaign = useUpdateCampaign();

  const handleActionClick = async (key: ProtectedIntentKey) => {
    setActionError(null);
    if (!authenticated) {
      onGuestRequireAuth(key);
      return;
    }
    setSelectedIntent(key);
    if (key === "follow") {
      try {
        await toggleBookmark.mutateAsync({ campaignId: campaign.id });
        await refetch();
      } catch (error) {
        setActionError(
          error instanceof Error
            ? error.message
            : "Unable to update bookmark state.",
        );
      }
    }
  };

  const handleDonationSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setActionError(null);
    setDonationSuccess(null);
    const amountToContribute = customAmount ? parseInt(customAmount, 10) : donateAmount;
    if (!amountToContribute || isNaN(amountToContribute) || amountToContribute < 10) {
      setActionError("Please enter a valid donation amount (minimum ₹10).");
      return;
    }

    try {
      const initRes = (await initiateDonation.mutateAsync({
        campaignId: campaign.id,
        amount: amountToContribute,
        currency: campaign.currency || "INR",
        privacyPreference: donorPrivacy,
        donorName: donorDisplayName.trim() || undefined,
      })) as {
        donationId: string;
        transactionReference: string;
        convertedAmount: number;
        baseCurrency: string;
      };

      const settleRes = (await verifyPayment.mutateAsync({
        transactionReference: initRes.transactionReference,
        gatewayTransactionId: `gw_escrow_${Date.now()}`,
        gateway: "escrow_pledge",
      })) as {
        success: boolean;
        blockchainTxHash?: string;
      };

      setDonationSuccess({
        amount: amountToContribute,
        currency: campaign.currency || "INR",
        transactionReference: initRes.transactionReference,
        blockchainTxHash: settleRes.blockchainTxHash,
      });

      await refetch();
      onCampaignUpdated?.();
    } catch (err) {
      setActionError(
        err instanceof Error ? err.message : "Unable to process donation into escrow.",
      );
    }
  };

  const handleReleaseMilestone = async (milestoneId: string) => {
    setActionError(null);
    setEscrowReleaseSuccess(null);
    try {
      const res = (await releaseMilestoneEscrow.mutateAsync({
        campaignId: campaign.id,
        milestoneId,
        adminNotes: "Audited and released by administrator",
      })) as {
        success: boolean;
        milestoneId: string;
        releasedAmount: number;
        blockchainTxHash: string;
      };

      setEscrowReleaseSuccess({
        milestoneId: res.milestoneId,
        blockchainTxHash: res.blockchainTxHash,
        releasedAmount: res.releasedAmount,
      });

      await refetch();
      onCampaignUpdated?.();
    } catch (err) {
      setActionError(
        err instanceof Error ? err.message : "Unable to release milestone escrow.",
      );
    }
  };

  const handleCommentSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    setActionError(null);
    const body = commentBody.trim();
    if (!body) return;
    try {
      await postComment.mutateAsync({ campaignId: campaign.id, body });
      setCommentBody("");
      await refetch();
    } catch (error) {
      setActionError(
        error instanceof Error ? error.message : "Unable to post comment.",
      );
    }
  };

  const handleChatSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setActionError(null);
    const message = chatMessage.trim();
    if (!message) return;
    try {
      await sendChat.mutateAsync({ campaignId: campaign.id, message });
      setChatMessage("");
      await refetch();
    } catch (error) {
      setActionError(
        error instanceof Error
          ? error.message
          : "Unable to send chat message.",
      );
    }
  };

  const handleAddDocument = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setActionError(null);
    if (!docTitle.trim() || !docUrl.trim()) return;
    const nextDocs: RestrictedDocumentItem[] = [
      ...(memberData?.restrictedDocuments ?? []),
      {
        title: docTitle.trim(),
        url: docUrl.trim(),
        ...(docNote.trim() ? { note: docNote.trim() } : {}),
      },
    ];
    try {
      await updateCampaign.mutateAsync({
        id: campaign.id,
        restrictedDocuments: nextDocs,
      });
      setDocTitle("");
      setDocUrl("");
      setDocNote("");
      await refetch();
    } catch (error) {
      setActionError(
        error instanceof Error
          ? error.message
          : "Unable to attach restricted document.",
      );
    }
  };

  const handleAddProof = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setActionError(null);
    if (!proofTitle.trim() || !proofSummary.trim()) return;
    const nextProofs: ProtectedProofItem[] = [
      ...(memberData?.protectedProofs ?? []),
      {
        title: proofTitle.trim(),
        summary: proofSummary.trim(),
        ...(proofUrl.trim() ? { url: proofUrl.trim() } : {}),
      },
    ];
    try {
      await updateCampaign.mutateAsync({
        id: campaign.id,
        protectedProofs: nextProofs,
      });
      setProofTitle("");
      setProofSummary("");
      setProofUrl("");
      await refetch();
    } catch (error) {
      setActionError(
        error instanceof Error
          ? error.message
          : "Unable to attach milestone proof.",
      );
    }
  };

  return (
    <section
      className="protected-actions-panel"
      aria-label="Member campaign actions"
    >
      <div className="protected-panel-head">
        <h2>
          <IconLock size={18} aria-hidden="true" /> Member &amp; Transparency
          Actions
        </h2>
        <p>
          {authenticated
            ? "You are signed in. Select an action below to interact with this campaign or inspect protected transparency records."
            : "Sign in is required for donations, restricted documents, protected proofs, owner contact details, chat, comments, and saving campaigns."}
        </p>
      </div>

      <div className="protected-actions-grid">
        {PROTECTED_ACTIONS.map((action) => {
          const isFollow = action.key === "follow";
          const isSaved = Boolean(memberData?.isSaved);
          const Icon =
            isFollow && isSaved
              ? IconBookmarkFilled
              : ACTION_ICONS[action.key];
          const label =
            isFollow && authenticated
              ? isSaved
                ? "Saved Campaign"
                : "Save / Follow Campaign"
              : action.label;

          return (
            <button
              key={action.key}
              type="button"
              disabled={isFollow && toggleBookmark.isPending}
              className={
                selectedIntent === action.key
                  ? "protected-action-btn active"
                  : "protected-action-btn"
              }
              onClick={() => void handleActionClick(action.key)}
            >
              <Icon size={17} aria-hidden="true" />
              <span>{label}</span>
            </button>
          );
        })}
      </div>

      {actionError && (
        <div className="protected-action-notice error" role="alert">
          <p>{actionError}</p>
        </div>
      )}

      {authenticated && selectedIntent && (
        <div className="member-workspace-panel" role="region" aria-live="polite">
          {isLoading ? (
            <div className="space-y-3" aria-busy="true">
              <Skeleton className="h-5 w-48 bg-[#e6eee1]" />
              <Skeleton className="h-16 w-full bg-[#e6eee1]" />
            </div>
          ) : isError ? (
            <div className="protected-action-notice error">
              <p>Unable to load member records right now.</p>
              <button
                type="button"
                className="text-link mt-2"
                onClick={() => void refetch()}
              >
                Retry
              </button>
            </div>
          ) : (
            <>
              {selectedIntent === "donate" && (
                <div className="member-section-block">
                  <h3>Back This Campaign &amp; Anchor to Escrow</h3>
                  <p className="member-muted mb-4">
                    Contributions are held in a transparent milestone escrow ledger. Funds are cryptographically anchored and only released to creators upon verified progress milestones and administrative audit.
                  </p>

                  {donationSuccess ? (
                    <div className="protected-action-notice mb-4">
                      <strong className="inline-flex items-center gap-1.5 text-[#1b432a]">
                        <IconCheck size={18} aria-hidden="true" />
                        Contribution Confirmed &amp; Anchored to Escrow!
                      </strong>
                      <p>
                        You successfully contributed <strong>{formatCampaignAmount(donationSuccess.amount, donationSuccess.currency)}</strong>.
                      </p>
                      <div className="mt-3 p-3 bg-[#f8fbf4] border border-[#d5e1cf] text-xs font-mono break-all space-y-1">
                        <div><span className="text-[#68826d]">Tx Reference:</span> {donationSuccess.transactionReference}</div>
                        {donationSuccess.blockchainTxHash && (
                          <div>
                            <span className="text-[#68826d]">Blockchain Proof:</span> {donationSuccess.blockchainTxHash}
                          </div>
                        )}
                        <div><span className="text-[#68826d]">Escrow Status:</span> Locked in Campaign Milestone Escrow</div>
                      </div>
                      <button
                        type="button"
                        className="button button-outline mt-3 text-xs"
                        onClick={() => {
                          setDonationSuccess(null);
                          setCustomAmount("");
                        }}
                      >
                        Make Another Contribution
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleDonationSubmit} className="member-inline-form space-y-4">
                      <div>
                        <span className="stat-label">Select Amount ({campaign.currency || "INR"})</span>
                        <div className="flex flex-wrap gap-2 my-2">
                          {[250, 500, 1000, 2500, 5000].map((amt) => (
                            <button
                              key={amt}
                              type="button"
                              className={`button ${
                                !customAmount && donateAmount === amt
                                  ? "button-dark"
                                  : "button-outline"
                              } text-xs py-1.5 px-3`}
                              onClick={() => {
                                setDonateAmount(amt);
                                setCustomAmount("");
                              }}
                            >
                              {formatCampaignAmount(amt, campaign.currency || "INR")}
                            </button>
                          ))}
                        </div>
                        <input
                          type="number"
                          min={10}
                          max={10000000}
                          placeholder="Or enter custom amount..."
                          value={customAmount}
                          onChange={(e) => setCustomAmount(e.target.value)}
                          className="w-full bg-[#fbfcf8] border border-[#d5e1cf] p-2 text-sm text-[#173d2e] mt-2"
                        />
                      </div>

                      <div className="member-inline-grid mt-3">
                        <input
                          type="text"
                          placeholder="Display Name (Optional)"
                          value={donorDisplayName}
                          onChange={(e) => setDonorDisplayName(e.target.value)}
                        />
                        <select
                          value={donorPrivacy}
                          onChange={(e) => setDonorPrivacy(e.target.value as "public" | "name_only" | "anonymous")}
                          className="bg-[#fbfcf8] border border-[#d5e1cf] p-2 text-xs text-[#173d2e]"
                        >
                          <option value="public">Public Supporter</option>
                          <option value="name_only">Display Name Only (Hide Amount)</option>
                          <option value="anonymous">Anonymous Backer</option>
                        </select>
                      </div>

                      <button
                        type="submit"
                        disabled={initiateDonation.isPending || verifyPayment.isPending}
                        className="button button-dark mt-4 flex items-center justify-center gap-2"
                      >
                        <IconCoin size={16} aria-hidden="true" />
                        {initiateDonation.isPending || verifyPayment.isPending
                          ? "Securing in Escrow..."
                          : `Contribute ${formatCampaignAmount(customAmount ? parseInt(customAmount, 10) || 0 : donateAmount, campaign.currency || "INR")} to Escrow`}
                      </button>
                    </form>
                  )}
                </div>
              )}

              {selectedIntent === "follow" && (
                <div className="protected-action-notice">
                  <strong className="inline-flex items-center gap-1.5">
                    <IconCheck size={16} aria-hidden="true" />
                    {memberData?.isSaved
                      ? "Campaign saved to your account"
                      : "Removed from saved campaigns"}
                  </strong>
                  <p>
                    {memberData?.isSaved
                      ? "You can revisit your saved campaigns anytime from the Creator & Saved Studio."
                      : "Click Save / Follow Campaign again whenever you want to bookmark this campaign."}
                  </p>
                </div>
              )}

              {selectedIntent === "contact" && (
                <div className="protected-action-notice">
                  <strong>Campaign Owner Contact Details</strong>
                  {memberData?.ownerContact ? (
                    <dl className="contact-detail-list">
                      {memberData.ownerContact.name && (
                        <div>
                          <dt>Organizer</dt>
                          <dd>{memberData.ownerContact.name}</dd>
                        </div>
                      )}
                      {memberData.ownerContact.email && (
                        <div>
                          <dt>Account Email</dt>
                          <dd>{memberData.ownerContact.email}</dd>
                        </div>
                      )}
                      {memberData.ownerContact.contact && (
                        <div>
                          <dt>Contact Note</dt>
                          <dd>{memberData.ownerContact.contact}</dd>
                        </div>
                      )}
                    </dl>
                  ) : (
                    <p>
                      No organizer contact details have been published for this
                      campaign yet.
                    </p>
                  )}
                </div>
              )}

              {selectedIntent === "documents" && (
                <div className="member-section-block">
                  <h3>Restricted Campaign Documents</h3>
                  {memberData && memberData.restrictedDocuments.length > 0 ? (
                    <ul className="member-record-list">
                      {memberData.restrictedDocuments.map((doc, idx) => (
                        <li key={`${doc.title}-${idx}`}>
                          <div>
                            <strong>{doc.title}</strong>
                            {doc.note && <p>{doc.note}</p>}
                          </div>
                          <a
                            href={doc.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-link"
                          >
                            Open{" "}
                            <IconExternalLink size={14} aria-hidden="true" />
                          </a>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="member-muted">
                      No restricted documents have been uploaded for this
                      campaign yet.
                    </p>
                  )}

                  {memberData?.isOwner && (
                    <form
                      className="member-inline-form"
                      onSubmit={handleAddDocument}
                    >
                      <h4>Add Restricted Document (Owner)</h4>
                      <div className="member-inline-grid">
                        <input
                          type="text"
                          required
                          placeholder="Document title (e.g. Budget Breakdown PDF)"
                          value={docTitle}
                          onChange={(e) => setDocTitle(e.target.value)}
                        />
                        <input
                          type="url"
                          required
                          placeholder="https://..."
                          value={docUrl}
                          onChange={(e) => setDocUrl(e.target.value)}
                        />
                        <input
                          type="text"
                          placeholder="Optional verification note"
                          value={docNote}
                          onChange={(e) => setDocNote(e.target.value)}
                        />
                      </div>
                      <button
                        type="submit"
                        className="button button-outline"
                        disabled={updateCampaign.isPending}
                      >
                        <IconPlus size={16} aria-hidden="true" />
                        Add Document
                      </button>
                    </form>
                  )}
                </div>
              )}

              {selectedIntent === "proofs" && (
                <div className="member-section-block">
                  <h3>Milestone Escrow &amp; Blockchain Proofs</h3>
                  <p className="member-muted mb-4">
                    Milestones represent verifiable stages of project execution. Raised funds remain locked in milestone escrow until independently audited and verified with expense proofs.
                  </p>

                  {escrowReleaseSuccess && (
                    <div className="protected-action-notice mb-4">
                      <strong className="inline-flex items-center gap-1.5 text-[#1b432a]">
                        <IconCheck size={18} aria-hidden="true" />
                        Escrow Tranche Released &amp; Anchored On-Chain!
                      </strong>
                      <p className="text-xs font-mono break-all mt-1">
                        TxHash: {escrowReleaseSuccess.blockchainTxHash}
                      </p>
                    </div>
                  )}

                  {memberData?.milestones && memberData.milestones.length > 0 && (
                    <div className="mb-6">
                      <h4 className="stat-label mb-2">Milestone Escrow Ledger</h4>
                      <ul className="member-record-list">
                        {memberData.milestones.map((m) => {
                          const isApproved = m.approvalStatus === "approved";
                          return (
                            <li key={m.id} className="flex-col !items-start gap-2">
                              <div className="flex w-full items-center justify-between">
                                <strong>{m.title}</strong>
                                <span className={`text-xs px-2 py-0.5 rounded font-semibold ${
                                  isApproved ? "bg-[#d4edd2] text-[#245b2e]" : "bg-[#fef3d6] text-[#7a5712]"
                                }`}>
                                  {isApproved ? "Tranche Released" : "Locked in Escrow"}
                                </span>
                              </div>
                              <p>{m.description}</p>
                              <div className="flex flex-wrap w-full items-center justify-between text-xs text-[#5e7060] pt-1 border-t border-[#e1eadb]">
                                <span>Budget: <strong>{formatCampaignAmount(m.proposedBudget, campaign.currency || "INR")}</strong></span>
                                <span>Progress: {m.completionStatus} · Audit: {m.approvalStatus}</span>
                              </div>
                              {isAdmin && !isApproved && (
                                <button
                                  type="button"
                                  disabled={releaseMilestoneEscrow.isPending}
                                  onClick={() => void handleReleaseMilestone(m.id)}
                                  className="button button-outline text-xs mt-2 self-end"
                                >
                                  {releaseMilestoneEscrow.isPending ? "Auditing..." : "Audit & Release Escrow Tranche"}
                                </button>
                              )}
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  )}

                  <h4 className="stat-label mb-2">Protected Verification Documents</h4>
                  {memberData && memberData.protectedProofs.length > 0 ? (
                    <ul className="member-record-list">
                      {memberData.protectedProofs.map((proof, idx) => (
                        <li key={`${proof.title}-${idx}`}>
                          <div>
                            <strong>{proof.title}</strong>
                            <p>{proof.summary}</p>
                          </div>
                          {proof.url && (
                            <a
                              href={proof.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-link"
                            >
                              Verify{" "}
                              <IconExternalLink size={14} aria-hidden="true" />
                            </a>
                          )}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="member-muted">
                      No additional milestone proofs have been attached to this
                      campaign yet.
                    </p>
                  )}

                  {memberData?.isOwner && (
                    <form
                      className="member-inline-form"
                      onSubmit={handleAddProof}
                    >
                      <h4>Add Milestone Proof (Owner)</h4>
                      <div className="member-inline-grid">
                        <input
                          type="text"
                          required
                          placeholder="Milestone title (e.g. Lab Equipment Receipt)"
                          value={proofTitle}
                          onChange={(e) => setProofTitle(e.target.value)}
                        />
                        <input
                          type="url"
                          placeholder="Optional https:// proof URL"
                          value={proofUrl}
                          onChange={(e) => setProofUrl(e.target.value)}
                        />
                        <input
                          type="text"
                          required
                          placeholder="Brief proof summary"
                          value={proofSummary}
                          onChange={(e) => setProofSummary(e.target.value)}
                        />
                      </div>
                      <button
                        type="submit"
                        className="button button-outline"
                        disabled={updateCampaign.isPending}
                      >
                        <IconPlus size={16} aria-hidden="true" />
                        Add Proof
                      </button>
                    </form>
                  )}
                </div>
              )}

              {selectedIntent === "comments" && (
                <div className="member-section-block">
                  <h3>Campaign Comments</h3>
                  <form
                    className="member-compose-form"
                    onSubmit={handleCommentSubmit}
                  >
                    <textarea
                      rows={3}
                      required
                      placeholder="Write a comment or question for the campaign team..."
                      value={commentBody}
                      onChange={(e) => setCommentBody(e.target.value)}
                    />
                    <button
                      type="submit"
                      className="button button-dark"
                      disabled={postComment.isPending}
                    >
                      <IconSend size={16} aria-hidden="true" />
                      {postComment.isPending ? "Posting..." : "Post Comment"}
                    </button>
                  </form>

                  {memberData && memberData.comments.length > 0 ? (
                    <ul className="member-feed-list">
                      {memberData.comments.map((item) => (
                        <li key={item.id}>
                          <div className="member-feed-meta">
                            <strong>
                              {item.authorName || item.authorEmail}
                            </strong>
                            <span>
                              {new Date(item.createdAt).toLocaleString()}
                            </span>
                          </div>
                          <p>{item.body}</p>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="member-muted">
                      No comments posted yet. Start the discussion above.
                    </p>
                  )}
                </div>
              )}

              {selectedIntent === "chat" && (
                <div className="member-section-block">
                  <h3>Supporter Group Chat</h3>
                  {memberData && memberData.chatMessages.length > 0 ? (
                    <ul className="member-feed-list">
                      {memberData.chatMessages.map((msg) => (
                        <li key={msg.id}>
                          <div className="member-feed-meta">
                            <strong>
                              {msg.senderName || msg.senderEmail}
                            </strong>
                            <span>
                              {new Date(msg.createdAt).toLocaleString()}
                            </span>
                          </div>
                          <p>{msg.message}</p>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="member-muted">
                      No group chat messages yet. Say hello to other supporters.
                    </p>
                  )}

                  <form
                    className="member-chat-bar"
                    onSubmit={handleChatSubmit}
                  >
                    <input
                      type="text"
                      required
                      placeholder="Send a message to the supporter group chat..."
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                    />
                    <button
                      type="submit"
                      className="button button-dark"
                      disabled={sendChat.isPending}
                    >
                      <IconSend size={16} aria-hidden="true" />
                      Send
                    </button>
                  </form>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </section>
  );
}

