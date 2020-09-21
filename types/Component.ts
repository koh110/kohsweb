import { FunctionComponent } from 'react'

export type LayoutComponent = FunctionComponent

export type PageComponent = FunctionComponent & { Layout?: LayoutComponent }
