import { FunctionComponent, PropsWithChildren } from 'react'

export type LayoutComponent = FunctionComponent<PropsWithChildren>

export type PageComponent = FunctionComponent & { Layout?: LayoutComponent }
