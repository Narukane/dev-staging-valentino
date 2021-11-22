/* library Package */
import { ShipmentTracker } from '@sirclo/nexus'

/* library Template */
import { useBrand } from 'lib/useBrand'

/* styles */
import styles from 'public/scss/pages/Track.module.scss'



const classesTrackerPage = {
  shipmentHeaderClassName: `${styles.track_shipmentHeader} ${styles.track_shipmentHeaderGuest}`,
  shipmentBodyClassName: `${styles.track_shipmentBody} ${styles.track_shipmentBodyGuest} d-flex justify-content-center`,
  shipmentFooterClassName: `${styles.track_shipmentFooter} d-flex justify-content-center text-center`,
  shipmentTrackingClassName: styles.track_shipmentTracking,
  shipmentHeaderTextClassName: styles.track_shipmentHeaderText,
  shipmentTextClassName: styles.track_shipmentText,
  shipmentNoteClassName: styles.track_shipmentNote,
  shipmentListClassName: styles.track_shipmentList,
  shipmentListWrapperClassName: styles.track_shipmentListWrapper,
  shipmentCloseIconClassName: styles.track_shipmentCloseIcon,
  shipmentTrackButtonClassName: `${styles.track_shipmentTrackButton} ${styles.track_shipmentTrackButtonGuest}`,
};

const TrackerPage = ({ order_token }) => {
  return (
    <ShipmentTracker

      awbNumber={"IN-SB-2-C2VTGFMAA2XUME"}
      shippingProvider="GRAB"
      iconTracker={
        <img
          className="mr-2"
          src={"/images/motorcycle.svg"}
          alt="motorcycle"
        />
      }
      classes={classesTrackerPage}
    />

  );
};

export async function getServerSideProps({ params, req }) {
  const brand = await useBrand(req);
  const defaultLanguage = brand?.settings?.defaultLanguage || params.lng || 'id';
  const { default: lngDict = {} } = await import(`locales/${defaultLanguage}.json`);

  return {
    props: {
      lng: defaultLanguage,
      lngDict,
      order_token: params.token
    },
  };
}

export default TrackerPage;