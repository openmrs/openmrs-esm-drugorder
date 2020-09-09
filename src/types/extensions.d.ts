import React, { ReactNode } from 'react';

declare module '@openmrs/esm-extension-manager' {
  export interface ExtensionSlotReactProps {
    extensionSlotName: string;
    children?: ReactNode;
  }

  export interface CancelLoading {
    (): void;
  }

  export interface ExtensionContextData {
    extensionSlotName: string;
    extensionName: string;
  }

  export const ExtensionContext: React.Context<ExtensionContextData>;

  export const ExtensionSlotReact: React.FC<ExtensionSlotReactProps>;

  export const ExtensionReact: React.FC;
}
