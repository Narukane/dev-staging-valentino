/* library package */
import { FC, useState } from 'react'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import {
	Article,
	useI18n
} from '@sirclo/nexus'

/* library template */
import { useBrand } from 'lib/useBrand'

/* components */
import Layout from 'components/Layout/Layout'
import SEO from 'components/SEO'
import Placeholder from 'components/Placeholder'

/* styles */
import styles from 'public/scss/pages/Article.module.scss'

const classesPlaceholderArticle = {
	placeholderImage: `${styles.placeholderItem} ${styles.placeholderItem_article}`,
}

const ArticleDetail: FC<any> = ({
	lng,
	lngDict,
	slug,
	brand
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
	const i18n: any = useI18n();

	const [title, setTitle] = useState<string>("");
	

	return (
		<Layout
			i18n={i18n}
			lng={lng}
			lngDict={lngDict}
			brand={brand}
		>
			<SEO title={title} />
			<section>
				<div className="container">
					<div className="row">
						<div className="col-12 col-lg-10 offset-lg-1">
							<Article
								containerClassName={styles.article}
								slug={slug as string}
								getTitle={setTitle}
								loadingComponent={
									<Placeholder classes={classesPlaceholderArticle} withImage />
								}
							/>
						</div>
					</div>
				</div>
			</section>
		</Layout>
	);
};

export const getServerSideProps: GetServerSideProps = async ({ req, params }) => {
	const brand = await useBrand(req);
	const defaultLanguage = brand?.settings?.defaultLanguage || params.lng || 'id';
	const { default: lngDict = {} } = await import(
		`locales/${defaultLanguage}.json`
	);

	return {
		props: {
			lng: defaultLanguage,
			lngDict,
			slug: params.slug,
			brand: brand || ""
		}
	};
}

export default ArticleDetail;
