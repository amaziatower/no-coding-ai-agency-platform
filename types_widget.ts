export interface IWidgetConfig {
  chainlitServer: string
  showCot?: boolean
  accessToken?: string
  theme?: 'light' | 'dark'
  fontFamily?: string
  headerText?: string
  logoUrl?: string
  button?: {
    containerId?: string
    imageUrl?: string
    style?: {
      size?: string
      bgcolor?: string
      color?: string
      bgcolorHover?: string
      borderColor?: string
      borderWidth?: string
      borderStyle?: string
      borderRadius?: string
      boxShadow?: string
    }
  }
}
