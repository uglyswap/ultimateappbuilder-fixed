"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntegrationsAgent = void 0;
const logger_1 = require("../utils/logger");
class IntegrationsAgent {
    async generate(context) {
        logger_1.logger.info('Integrations Agent: Generating third-party integrations');
        const files = [];
        const integrations = context.config.integrations || [];
        for (const integration of integrations) {
            switch (integration.type) {
                case 'stripe':
                    files.push(...this.generateStripeIntegration());
                    break;
                case 'sendgrid':
                    files.push(...this.generateSendGridIntegration());
                    break;
                case 'aws':
                    files.push(...this.generateAWSIntegration());
                    break;
                case 'github':
                    files.push(...this.generateGitHubIntegration());
                    break;
            }
        }
        return { files };
    }
    generateStripeIntegration() {
        return [
            {
                path: 'backend/src/services/stripe-service.ts',
                content: `import Stripe from 'stripe';
import { config } from '../config';

const stripe = new Stripe(config.integrations.stripe.secretKey, {
  apiVersion: '2024-11-20.acacia',
});

export class StripeService {
  async createCustomer(email: string, name?: string) {
    return stripe.customers.create({
      email,
      name,
    });
  }

  async createCheckoutSession(
    customerId: string,
    priceId: string,
    successUrl: string,
    cancelUrl: string
  ) {
    return stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: successUrl,
      cancel_url: cancelUrl,
    });
  }

  async createPortalSession(customerId: string, returnUrl: string) {
    return stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    });
  }

  async constructWebhookEvent(payload: string, signature: string) {
    return stripe.webhooks.constructEvent(
      payload,
      signature,
      config.integrations.stripe.webhookSecret
    );
  }

  async cancelSubscription(subscriptionId: string) {
    return stripe.subscriptions.cancel(subscriptionId);
  }
}

export const stripeService = new StripeService();
`,
                language: 'typescript',
                description: 'Stripe integration service',
            },
            {
                path: 'backend/src/routes/webhooks.ts',
                content: `import { Router, Request, Response } from 'express';
import { stripeService } from '../services/stripe-service';
import { logger } from '../utils/logger';

const router = Router();

router.post('/stripe', async (req: Request, res: Response) => {
  const signature = req.headers['stripe-signature'] as string;

  try {
    const event = await stripeService.constructWebhookEvent(
      req.body,
      signature
    );

    logger.info('Stripe webhook event:', { type: event.type });

    switch (event.type) {
      case 'checkout.session.completed':
        // Handle successful checkout
        break;
      case 'customer.subscription.deleted':
        // Handle subscription cancellation
        break;
      case 'invoice.payment_succeeded':
        // Handle successful payment
        break;
      case 'invoice.payment_failed':
        // Handle failed payment
        break;
    }

    res.json({ received: true });
  } catch (error) {
    logger.error('Stripe webhook error:', error);
    res.status(400).send('Webhook Error');
  }
});

export default router;
`,
                language: 'typescript',
                description: 'Stripe webhooks handler',
            },
        ];
    }
    generateSendGridIntegration() {
        return [
            {
                path: 'backend/src/services/email-service.ts',
                content: `import sgMail from '@sendgrid/mail';
import { config } from '../config';
import { logger } from '../utils/logger';

sgMail.setApiKey(config.integrations.sendgrid?.apiKey || '');

export class EmailService {
  async send(to: string, subject: string, html: string) {
    try {
      await sgMail.send({
        to,
        from: config.email.fromAddress,
        subject,
        html,
      });
      logger.info('Email sent successfully', { to, subject });
    } catch (error) {
      logger.error('Email sending failed', { error, to });
      throw error;
    }
  }

  async sendWelcome(to: string, name: string) {
    const html = \`
      <h1>Welcome, \${name}!</h1>
      <p>Thanks for joining us. We're excited to have you on board.</p>
    \`;
    await this.send(to, 'Welcome!', html);
  }

  async sendPasswordReset(to: string, resetLink: string) {
    const html = \`
      <h1>Reset Your Password</h1>
      <p>Click the link below to reset your password:</p>
      <a href="\${resetLink}">Reset Password</a>
      <p>This link will expire in 1 hour.</p>
    \`;
    await this.send(to, 'Password Reset', html);
  }
}

export const emailService = new EmailService();
`,
                language: 'typescript',
                description: 'SendGrid email service',
            },
        ];
    }
    generateAWSIntegration() {
        return [
            {
                path: 'backend/src/services/storage-service.ts',
                content: `import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { config } from '../config';

const s3Client = new S3Client({
  region: config.integrations.aws.region,
  credentials: {
    accessKeyId: config.integrations.aws.accessKeyId,
    secretAccessKey: config.integrations.aws.secretAccessKey,
  },
});

export class StorageService {
  private bucket = config.storage.bucket;

  async upload(key: string, body: Buffer, contentType: string) {
    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      Body: body,
      ContentType: contentType,
    });

    await s3Client.send(command);
    return \`https://\${this.bucket}.s3.amazonaws.com/\${key}\`;
  }

  async getSignedUrl(key: string, expiresIn = 3600) {
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });

    return getSignedUrl(s3Client, command, { expiresIn });
  }

  async delete(key: string) {
    const command = new DeleteObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });

    await s3Client.send(command);
  }
}

export const storageService = new StorageService();
`,
                language: 'typescript',
                description: 'AWS S3 storage service',
            },
        ];
    }
    generateGitHubIntegration() {
        return [
            {
                path: 'backend/src/services/github-service.ts',
                content: `import { Octokit } from '@octokit/rest';
import { config } from '../config';

const octokit = new Octokit({
  auth: config.integrations.github.token,
});

export class GitHubService {
  async createRepository(name: string, description: string, isPrivate = false) {
    const { data } = await octokit.repos.createForAuthenticatedUser({
      name,
      description,
      private: isPrivate,
      auto_init: true,
    });

    return data;
  }

  async pushFiles(owner: string, repo: string, files: { path: string; content: string }[]) {
    for (const file of files) {
      await octokit.repos.createOrUpdateFileContents({
        owner,
        repo,
        path: file.path,
        message: \`Add \${file.path}\`,
        content: Buffer.from(file.content).toString('base64'),
      });
    }
  }

  async getRepository(owner: string, repo: string) {
    const { data } = await octokit.repos.get({ owner, repo });
    return data;
  }
}

export const githubService = new GitHubService();
`,
                language: 'typescript',
                description: 'GitHub integration service',
            },
        ];
    }
}
exports.IntegrationsAgent = IntegrationsAgent;
//# sourceMappingURL=integrations.js.map