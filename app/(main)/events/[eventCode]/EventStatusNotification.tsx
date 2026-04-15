"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

interface EventStatusNotificationProps {
  event: {
    eventCode: string;
    isNominationOpen: boolean;
    isVotingOpen: boolean;
    nominationStartsAt?: Date | string | null;
    nominationEndsAt?: Date | string | null;
    votingStartsAt?: Date | string | null;
    votingEndsAt?: Date | string | null;
    title: string;
  };
}

export default function EventStatusNotification({
  event,
}: EventStatusNotificationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [modalContent, setModalContent] = useState<{
    title: string;
    description: string;
    icon: React.ReactNode;
    actionLabel?: string;
    action?: () => void;
  } | null>(null);

  const router = useRouter();

  useEffect(() => {
    // Determine the status and content
    // Priority: Voting Open > Nomination Open > Closed with Future Dates > General Closed

    // We use a session storage flag to prevent showing it every single refresh if the user closed it
    // But for "Call to Actions" like Voting/Nomination, it's often good to show it or have a persistent banner.
    // Making it a modal implies we show it once per session or until interaction.
    const hasSeenModal = sessionStorage.getItem(
      `seen_status_modal_${event.eventCode}`
    );

    if (hasSeenModal) return;

    if (event.isVotingOpen) {
      setModalContent({
        title: "Voting is Live! 🗳️",
        description: `Cast your vote for your favorite candidates in ${event.title}. Voting is currently open and active.`,
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-primary"
          >
            <path d="m9 12 2 2 4-4" />
            <path d="M5 7c0-1.1.9-2 2-2h10a2 2 0 0 1 2 2v12H5V7Z" />
            <path d="M22 19H2" />
          </svg>
        ),
        actionLabel: "Vote Now",
        action: () => {
          // Scroll to categories or just close to let them browse
          const element = document.getElementById("categories-section");
          if (element) {
            element.scrollIntoView({ behavior: "smooth" });
          }
          setIsOpen(false);
        },
      });
      setIsOpen(true);
    } else if (event.isNominationOpen) {
      setModalContent({
        title: "Nominations are Open! 📝",
        description: `We are currently accepting nominations for ${event.title}. Do you know someone who deserves this award?`,
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-blue-500"
          >
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <line x1="19" y1="8" x2="19" y2="14" />
            <line x1="22" y1="11" x2="16" y2="11" />
          </svg>
        ),
        actionLabel: "Nominate Now",
        action: () => {
          router.push(`/events/nominate?eventCode=${event.eventCode}`);
          setIsOpen(false);
        },
      });
      setIsOpen(true);
    } else {
      // Both Closed - check for future dates
      const now = new Date();
      const votingStart = event.votingStartsAt
        ? new Date(event.votingStartsAt)
        : null;
      const nominationStart = event.nominationStartsAt
        ? new Date(event.nominationStartsAt)
        : null;

      if (votingStart && votingStart > now) {
        setModalContent({
          title: "Voting Coming Soon ⏳",
          description: `Voting for ${
            event.title
          } is scheduled to start on ${format(votingStart, "PPP")}. Get ready!`,
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-orange-500"
            >
              <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          ),
          actionLabel: "Got it",
          action: () => setIsOpen(false),
        });
        setIsOpen(true);
      } else if (nominationStart && nominationStart > now) {
        setModalContent({
          title: "Nominations Opening Soon 🔜",
          description: `Nominations for ${event.title} will open on ${format(
            nominationStart,
            "PPP"
          )}.`,
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-purple-500"
            >
              <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          ),
          actionLabel: "Okay",
          action: () => setIsOpen(false),
        });
        setIsOpen(true);
      } else {
        // Default generic closed status or completely ended
        // Only show if we explicitly want to inform about "Ended"
        // For now, maybe we don't pop up anything if everything is over, to be less annoying.
        // Or we can say "Event has ended".
        const votingEnd = event.votingEndsAt
          ? new Date(event.votingEndsAt)
          : null;
        if (votingEnd && votingEnd < now) {
          setModalContent({
            title: "Voting Ended 🏁",
            description: `Voting for ${event.title} has officially ended. Thank you for participating!`,
            icon: (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-gray-500"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 16v-4" />
                <path d="M12 8h.01" />
              </svg>
            ),
            actionLabel: "Close",
            action: () => setIsOpen(false),
          });
          setIsOpen(true);
        }
      }
    }
  }, [event, router]);

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem(`seen_status_modal_${event.eventCode}`, "true");
  };

  const handleAction = () => {
    if (modalContent?.action) {
      modalContent.action();
    }
    // Also mark as seen if they take action?
    // Maybe not, so they can see it again technically, but usually action implies dismissal of the notification nature.
    sessionStorage.setItem(`seen_status_modal_${event.eventCode}`, "true");
  };

  if (!modalContent) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md text-center">
        <DialogHeader className="flex flex-col items-center gap-4">
          <div className="p-3 rounded-full bg-secondary/20">
            {modalContent.icon}
          </div>
          <DialogTitle className="text-2xl">{modalContent.title}</DialogTitle>
          <DialogDescription className="text-base text-center">
            {modalContent.description}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-center w-full mt-4">
          <Button
            variant="default"
            size="lg"
            className="w-full sm:w-auto min-w-[150px] bg-secondary-700 hover:bg-secondary-600 cursor-pointer"
            onClick={handleAction}
          >
            {modalContent.actionLabel || "Close"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
