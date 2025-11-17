import { Sheet } from '@ui/Sheet';
import type { Message } from 'ai';
import React, { type ReactNode, type RefCallback, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Workbench } from '~/components/workbench/Workbench.client';
import type { ToolStatus } from '~/lib/common/types';
import type { TerminalInitializationOptions } from '~/types/terminal';
import type { ModelSelection } from '~/utils/constants';
import { MessageInput } from './MessageInput';
import { useChatId } from '~/lib/stores/chatId';
import { getConvexSiteUrl } from '~/lib/convexSiteUrl';
import { messageInputStore } from '~/lib/stores/messageInput';
import { useConvexSessionIdOrNullOrLoading } from '~/lib/stores/sessionId';
import type { ActionAlert } from '~/types/actions';
import { classNames } from '~/utils/classNames';
import styles from './BaseChat.module.css';
import ChatAlert from './ChatAlert';
import { Messages } from './Messages.client';
import StreamingIndicator from './StreamingIndicator';
import { SuggestionButtons } from './SuggestionButtons';
import { useLaunchDarkly } from '~/lib/hooks/useLaunchDarkly';
import { CompatibilityWarnings } from '~/components/CompatibilityWarnings.client';
import { chooseExperience } from '~/utils/experienceChooser';
import { AnimatePresence, motion } from 'framer-motion';
import { useStore } from '@nanostores/react';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import { SubchatBar } from './SubchatBar';
import { SubchatLimitNudge } from './SubchatLimitNudge';
import { useMutation } from 'convex/react';
import { api } from '@convex/_generated/api';
import { subchatIndexStore, useIsSubchatLoaded } from '~/lib/stores/subchats';
import { INITIAL_FEATURES, ADDITIONAL_FEATURES } from 'chef-agent/constants';
import { HeroVideoBackground, HeroTextContent } from './AnimatedHero.client';

interface BaseChatProps {
  // Refs
  messageRef: RefCallback<HTMLDivElement> | undefined;
  scrollRef: RefCallback<HTMLDivElement> | undefined;

  // Top-level chat props
  showChat: boolean;
  chatStarted: boolean;
  description: string | undefined;

  // Chat user interactions
  onStop: () => void;
  onSend: (messageInput: string) => Promise<void>;
  sendMessageInProgress: boolean;

  // Current chat history props
  streamStatus: 'streaming' | 'submitted' | 'ready' | 'error';
  currentError: Error | undefined;
  toolStatus: ToolStatus;
  messages: Message[];
  terminalInitializationOptions: TerminalInitializationOptions | undefined;
  disableChatMessage: ReactNode | string | null;

  // Model selection props
  modelSelection: ModelSelection;
  setModelSelection: (modelSelection: ModelSelection) => void;

  // Alert related props
  actionAlert: ActionAlert | undefined;
  clearAlert: () => void;

  // Rewind functionality
  onRewindToMessage?: (subchatIndex?: number, messageIndex?: number) => void;

  // Subchat navigation props
  currentSubchatIndex?: number;
  totalSubchats?: number;
  subchats?: { subchatIndex: number; updatedAt: number; description?: string }[];
}

export const BaseChat = React.forwardRef<HTMLDivElement, BaseChatProps>(
  (
    {
      messageRef,
      scrollRef,
      showChat = true,
      chatStarted = false,
      streamStatus = 'ready',
      currentError,
      onSend,
      onStop,
      sendMessageInProgress,
      messages,
      actionAlert,
      clearAlert,
      toolStatus,
      terminalInitializationOptions,
      disableChatMessage,
      modelSelection,
      setModelSelection,
      onRewindToMessage,
      subchats,
    },
    ref,
  ) => {
    const { maintenanceMode } = useLaunchDarkly();

    const isStreaming = streamStatus === 'streaming' || streamStatus === 'submitted';
    const recommendedExperience = chooseExperience(navigator.userAgent, window.crossOriginIsolated);
    const [chatEnabled, setChatEnabled] = useState(recommendedExperience === 'the-real-thing');
    const [showMoreFeatures, setShowMoreFeatures] = useState(false);
    const currentSubchatIndex = useStore(subchatIndexStore) ?? 0;
    const { newChatFeature, minMessagesForNudge } = useLaunchDarkly();
    const shouldShowNudge = newChatFeature && messages.length > minMessagesForNudge;
    const createSubchat = useMutation(api.subchats.create);
    const isSubchatLoaded = useIsSubchatLoaded();

    useEffect(() => {
      const hasDismissedMobileWarning = localStorage.getItem('hasDismissedMobileWarning') === 'true';
      if (hasDismissedMobileWarning) {
        setChatEnabled(true);
      }
    }, []);

    const chatId = useChatId();
    const sessionId = useConvexSessionIdOrNullOrLoading();
    const dataForEvals = useMemo(() => {
      return JSON.stringify({
        chatId,
        sessionId,
        convexSiteUrl: getConvexSiteUrl(),
      });
    }, [chatId, sessionId]);

    // Store scroll element reference
    const scrollElementRef = useRef<HTMLDivElement | null>(null);

    // Ensure chat is visible (scroll to top) when page loads
    useEffect(() => {
      if (!chatStarted && scrollElementRef.current) {
        // Scroll to top immediately when page loads
        scrollElementRef.current.scrollTo({ top: 0, behavior: 'instant' });
      }
    }, [chatStarted]);

    // Enhanced scrollRef that stores the element
    const enhancedScrollRef = useCallback((node: HTMLDivElement | null) => {
      scrollElementRef.current = node;
      if (scrollRef && typeof scrollRef === 'function') {
        scrollRef(node);
      }
    }, [scrollRef]);

    const handleCreateSubchat = useCallback(async () => {
      if (!sessionId) {
        return;
      }
      const subchatIndex = await createSubchat({ chatId, sessionId });
      subchatIndexStore.set(subchatIndex);
      messageInputStore.set('');
    }, [createSubchat, chatId, sessionId]);

    const lastUserMessage = messages.findLast((message) => message.role === 'user');
    const resendMessage = useCallback(async () => {
      if (lastUserMessage) {
        await onSend?.(lastUserMessage.content);
      }
    }, [lastUserMessage, onSend]);
    const baseChat = (
      <div
        ref={ref}
        className={classNames(styles.BaseChat, 'relative flex h-full w-full overflow-hidden')}
        style={{ zIndex: 1 }}
        data-chat-visible={showChat}
        data-messages-for-evals={dataForEvals}
      >
        <div 
          ref={enhancedScrollRef} 
          className="flex size-full flex-col overflow-y-auto"
          style={{ scrollBehavior: 'smooth' }}
          data-scroll-container
        >
          <div className="flex w-full grow flex-col lg:flex-row">
            <div
              className={classNames(styles.Chat, 'flex flex-col flex-grow lg:min-w-[var(--chat-min-width)] h-full relative', {
                'items-center px-4 sm:px-8 lg:px-12': !chatStarted,
                'pt-6': chatStarted,
              })}
            >
              {/* Video background - only show when chat hasn't started */}
              {!chatStarted && <HeroVideoBackground />}
              
              {/* Modern gradient background overlay with enhanced depth - only show when chat started */}
              {chatStarted && (
                <>
                  <div className="absolute inset-0 bg-gradient-to-br from-background-primary via-background-secondary/40 to-background-primary pointer-events-none" />
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-util-accent/5 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-util-info/5 via-transparent to-transparent pointer-events-none" />
                </>
              )}
              <div
                className={classNames('w-full relative z-10', {
                  'h-full flex flex-col': chatStarted,
                  'max-w-7xl': !chatEnabled,
                })}
                ref={scrollRef}
              >
                {!chatStarted && (
                  <div id="intro" className="relative mx-auto mb-12 mt-16 max-w-5xl px-4 text-center md:mt-20 lg:px-0">
                    <HeroTextContent />
                  </div>
                )}
                {chatStarted ? (
                  <>
                    {newChatFeature && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, ease: 'easeOut' }}
                      >
                        <SubchatBar
                          subchats={subchats}
                          currentSubchatIndex={currentSubchatIndex}
                          isStreaming={isStreaming}
                          disableChatMessage={disableChatMessage !== null || messages.length === 0}
                          sessionId={sessionId ?? null}
                          onRewind={onRewindToMessage}
                          handleCreateSubchat={handleCreateSubchat}
                          isSubchatLoaded={isSubchatLoaded}
                        />
                      </motion.div>
                    )}

                    {isSubchatLoaded && (
                      <AnimatePresence mode="wait">
                        <motion.div
                          key="messages"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                          className="mx-auto flex w-full max-w-chat flex-1 flex-col"
                        >
                          <Messages
                            ref={messageRef}
                            className="z-[1] mx-auto flex w-full max-w-chat flex-1 flex-col gap-5 pb-8"
                            messages={messages}
                            isStreaming={isStreaming}
                            onRewindToMessage={onRewindToMessage}
                            subchatsLength={subchats?.length}
                          />
                        </motion.div>
                      </AnimatePresence>
                    )}
                  </>
                ) : null}
                <div
                  className={classNames('flex flex-col w-full max-w-chat mx-auto z-prompt relative', {
                    'sticky bottom-four': chatStarted,
                  })}
                >
                  {actionAlert && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="mb-4"
                    >
                      <ChatAlert
                        alert={
                          actionAlert ?? {
                            type: 'ExceededQuota',
                            title: 'Error',
                            description: 'Error',
                            content: 'Error',
                            source: 'terminal',
                          }
                        }
                        clearAlert={() => clearAlert?.()}
                        postMessage={(message) => {
                          onSend?.(message);
                          clearAlert?.();
                        }}
                      />
                    </motion.div>
                  )}
                  {chatEnabled && (!subchats || (currentSubchatIndex >= subchats.length - 1 && isSubchatLoaded)) && (
                    <>
                      {shouldShowNudge && sessionId && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                          className="mb-4"
                        >
                          <SubchatLimitNudge
                            sessionId={sessionId}
                            chatId={chatId}
                            messageCount={messages.length}
                            handleCreateSubchat={handleCreateSubchat}
                          />
                        </motion.div>
                      )}

                      {/* StreamingIndicator is now a normal block above the input */}
                      {!disableChatMessage && !shouldShowNudge && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.3 }}
                        >
                          <StreamingIndicator
                            streamStatus={streamStatus}
                            numMessages={messages?.length ?? 0}
                            numSubchats={subchats?.length ?? 1}
                            toolStatus={toolStatus}
                            currentError={currentError}
                            resendMessage={resendMessage}
                            modelSelection={modelSelection}
                          />
                        </motion.div>
                      )}

                      {!shouldShowNudge && (
                        <>
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                          >
                            <MessageInput
                              chatStarted={chatStarted}
                              isStreaming={isStreaming}
                              sendMessageInProgress={sendMessageInProgress}
                              disabled={disableChatMessage !== null || maintenanceMode}
                              modelSelection={modelSelection}
                              setModelSelection={setModelSelection}
                              onStop={onStop}
                              onSend={onSend}
                              numMessages={messages?.length}
                            />
                          </motion.div>
                          
                          {/* Feature highlights below chat input */}
                          {!chatStarted && (
                            <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.6, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                              className="mx-auto mt-6 max-w-3xl"
                            >
                              <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4">
                                {INITIAL_FEATURES.map((feature, index) => (
                                  <motion.div
                                    key={feature.text}
                                    initial={{ opacity: 0, scale: 0.8, y: 10 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: 0.5 + index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                                    className="group relative flex items-center gap-2 rounded-xl border border-content-tertiary/20 bg-gradient-to-br from-background-secondary/50 to-background-secondary/30 px-4 py-2.5 backdrop-blur-md transition-all duration-300 hover:border-util-accent/40 hover:bg-gradient-to-br hover:from-background-secondary/70 hover:to-background-secondary/50 hover:shadow-lg hover:shadow-util-accent/10 hover:-translate-y-0.5"
                                  >
                                    <span className="text-xl transition-transform duration-300 group-hover:scale-110">{feature.icon}</span>
                                    <span className="text-xs font-semibold text-content-secondary transition-colors duration-300 group-hover:text-content-primary md:text-sm">
                                      {feature.text}
                                    </span>
                                    {/* Subtle glow effect on hover */}
                                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-util-accent/0 via-util-accent/5 to-util-accent/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                                  </motion.div>
                                ))}
                              </div>
                              
                              {/* Additional features with expand/collapse */}
                              <AnimatePresence>
                                {showMoreFeatures && (
                                  <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                                    className="overflow-hidden"
                                  >
                                    <div className="mt-3 flex flex-wrap items-center justify-center gap-3 md:gap-4">
                                      {ADDITIONAL_FEATURES.map((feature, index) => (
                                        <motion.div
                                          key={feature.text}
                                          initial={{ opacity: 0, scale: 0.8, y: 10 }}
                                          animate={{ opacity: 1, scale: 1, y: 0 }}
                                          exit={{ opacity: 0, scale: 0.8 }}
                                          transition={{ duration: 0.3, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
                                          className="group relative flex items-center gap-2 rounded-xl border border-content-tertiary/20 bg-gradient-to-br from-background-secondary/50 to-background-secondary/30 px-4 py-2.5 backdrop-blur-md transition-all duration-300 hover:border-util-accent/40 hover:bg-gradient-to-br hover:from-background-secondary/70 hover:to-background-secondary/50 hover:shadow-lg hover:shadow-util-accent/10 hover:-translate-y-0.5"
                                        >
                                          <span className="text-xl transition-transform duration-300 group-hover:scale-110">{feature.icon}</span>
                                          <span className="text-xs font-semibold text-content-secondary transition-colors duration-300 group-hover:text-content-primary md:text-sm">
                                            {feature.text}
                                          </span>
                                          {/* Subtle glow effect on hover */}
                                          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-util-accent/0 via-util-accent/5 to-util-accent/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                                        </motion.div>
                                      ))}
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                              
                              {/* See More / See Less button */}
                              <motion.button
                                onClick={() => setShowMoreFeatures(!showMoreFeatures)}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.4, delay: 0.7 }}
                                className="mx-auto mt-4 flex items-center gap-2 rounded-full border border-content-tertiary/20 bg-gradient-to-br from-background-secondary/50 to-background-secondary/30 px-4 py-2 text-xs font-semibold text-content-secondary transition-all duration-300 hover:border-util-accent/40 hover:bg-gradient-to-br hover:from-background-secondary/70 hover:to-background-secondary/50 hover:text-content-primary md:text-sm"
                              >
                                {showMoreFeatures ? (
                                  <>
                                    <span>See Less</span>
                                    <ChevronUpIcon className="size-4" />
                                  </>
                                ) : (
                                  <>
                                    <span>See More</span>
                                    <ChevronDownIcon className="size-4" />
                                  </>
                                )}
                              </motion.button>
                            </motion.div>
                          )}
                        </>
                      )}
                    </>
                  )}
                  <AnimatePresence>
                    {disableChatMessage && (
                      <motion.div
                        initial={{ translateY: '-100%', opacity: 0 }}
                        animate={{ translateY: '0%', opacity: 1 }}
                        exit={{ translateY: '-100%', opacity: 0 }}
                        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <Sheet
                          className="-mt-2 flex w-full flex-col gap-3 rounded-2xl rounded-t-none bg-gradient-to-br from-util-accent/15 via-util-accent/10 to-util-accent/5 p-5 shadow-2xl backdrop-blur-xl border border-util-accent/20"
                          padding={false}
                        >
                          {disableChatMessage}
                        </Sheet>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                {!chatEnabled && <CompatibilityWarnings setEnabled={setChatEnabled} />}
              </div>
              {maintenanceMode && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="relative z-10 mx-auto my-6 max-w-chat"
                >
                  <div className="relative rounded-2xl border border-red-400/50 bg-gradient-to-br from-red-100/90 to-red-50/90 px-5 py-4 text-red-700 shadow-lg backdrop-blur-sm dark:border-red-600/50 dark:from-red-900/90 dark:to-red-800/90 dark:text-red-200">
                    <p className="font-bold text-base">Chef is temporarily unavailable</p>
                    <p className="text-sm mt-1">
                      We&apos;re experiencing high load and will be back soon. Thank you for your patience.
                    </p>
                  </div>
                </motion.div>
              )}
              {chatEnabled && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="relative z-10"
                >
                  <SuggestionButtons
                    disabled={disableChatMessage !== null}
                    chatStarted={chatStarted}
                    onSuggestionClick={(suggestion) => {
                      messageInputStore.set(suggestion);
                    }}
                  />
                </motion.div>
              )}
            </div>
            <Workbench
              chatStarted={chatStarted}
              isStreaming={isStreaming}
              terminalInitializationOptions={terminalInitializationOptions}
            />
          </div>
          {!chatStarted && (
            <footer
              id="footer"
              className="relative z-10 w-full border-t border-content-tertiary/10 bg-background-primary/50 backdrop-blur-sm"
            >
              <div className="mx-auto max-w-7xl px-6 py-8 sm:px-8">
                <div className="flex flex-col items-center justify-center gap-4 text-center sm:flex-row sm:justify-between">
                  <div className="flex flex-col items-center gap-2 sm:items-start">
                    <p className="font-display text-sm font-medium text-content-secondary">
                      Powered by{' '}
                      <span className="font-bold text-content-primary transition-colors hover:text-content-accent">
                        Chef
                      </span>
                    </p>
                    <p className="text-xs text-content-tertiary">
                      Built with{' '}
                      <a
                        href="https://github.com/get-convex/chef"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-content-link transition-colors hover:text-content-accent hover:underline"
                      >
                        open-source
                      </a>{' '}
                      technology from{' '}
                      <a
                        href="https://www.convex.dev"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-content-link transition-colors hover:text-content-accent hover:underline"
                      >
                        Convex
                      </a>
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <a
                      href="https://github.com/get-convex/chef"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 rounded-lg border border-content-tertiary/20 bg-background-secondary/50 px-4 py-2 text-sm font-medium text-content-secondary transition-all hover:border-content-tertiary/40 hover:bg-background-secondary hover:text-content-primary"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                          clipRule="evenodd"
                        />
                      </svg>
                      View on GitHub
                    </a>
                  </div>
                </div>
              </div>
            </footer>
          )}
        </div>
      </div>
    );

    return baseChat;
  },
);
BaseChat.displayName = 'BaseChat';
