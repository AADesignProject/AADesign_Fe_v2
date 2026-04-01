import Document, {
  DocumentContext,
  DocumentInitialProps,
  Head,
  Html,
  Main,
  NextScript,
} from 'next/document';

interface CustomDocumentProps extends DocumentInitialProps {
  locale: string;
}

export default class CustomDocument extends Document<CustomDocumentProps> {
  static async getInitialProps(
    ctx: DocumentContext
  ): Promise<CustomDocumentProps> {
    const initialProps = await Document.getInitialProps(ctx);

    return {
      ...initialProps,
      locale: ctx.locale ?? ctx.defaultLocale ?? 'vi',
    };
  }

  render() {
    return (
      <Html lang={this.props.locale}>
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
