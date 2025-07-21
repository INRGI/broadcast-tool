import { Provider } from "@nestjs/common";
import { VerifyCopyForDomainService } from "./services/verify-copy-for-domain/verify-copy-for-domain.service";
import { VerifyWarmupCopyForDomainService } from "./services/verify-warmup-copy-for-domain/verify-warmup-copy-for-domain.service";
import { VerifyCopyWithoutQueueService } from "./services/verify-copy-without-queue/verify-copy-without-queue.service";
import { VerifyTestCopyForDomainService } from "./services/verify-test-copy-for-domain/verify-test-copy-for-domain.service";
import { VerifyConvCopyForDomainService } from "./services/verify-conv-copy-for-domain/verify-conv-copy-for-domain.service";
import { ReverifyCopyService } from "./services/reverify-copy/reverify-copy.service";

export const messageControllers = [];

export const applicationProviders: Provider[] = [];

export const serviceProviders: Provider[] = [
  VerifyCopyForDomainService,
  VerifyWarmupCopyForDomainService,
  VerifyCopyWithoutQueueService,
  VerifyTestCopyForDomainService,
  VerifyConvCopyForDomainService,
  ReverifyCopyService,
];
