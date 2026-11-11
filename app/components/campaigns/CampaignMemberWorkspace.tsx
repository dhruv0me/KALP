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
  usePostCampaignComment,
  useSendCampaignChat,
  useToggleCampaignBookmark,
  useUpdateCampaign,
} from "@/hooks/use-campaigns";
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
}

export function CampaignMemberWorkspace({
  campaign,
  authenticated,
  initialIntent = null,
  onGuestRequireAuth,
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
                <div className="protected-action-notice">
                  <strong>Make a Donation</strong>
                  <p>
                    {campaign.targetAmount != null
                      ? `Target: ${formatCampaignAmount(campaign.targetAmount, campaign.currency)}. `
                      : ""}
                    Live payment gateway and blockchain settlement are not yet
                    connected in this workspace, so payments cannot be submitted
                    or simulated yet.
                  </p>
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
                  <h3>Protected Milestone Proofs</h3>
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
                      No protected milestone proofs have been attached to this
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

