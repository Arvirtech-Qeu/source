import React, { useEffect, useState } from 'react';
import './Timeline.css';
import ApiService from '../../../../tech/core/common/services/ApiServices';
import FormattedDate from '../../../../tech/core/common/utils/timeFormate';

function Timeline({ searchSno }: any) {
  const [trackData, setTrackData] = useState([]);
  useEffect(() => {
    searchSkuTraceWf();
  }, [searchSno]);
  console.log(searchSno)

  const searchSkuTraceWf = async () => {
    if (searchSno) {
      try {
        const body = { "skuInventorySno": searchSno };
        const result = await ApiService('8912', 'post', 'search_sku_trace_wf', body, null);
        console.log(result)
        if (result?.data) {
          setTrackData(result?.data);
          // setData(result?.data)
        }
      }
      catch (error) {
        console.error('Error fetching SkuTraceWfs', error);
      }
    }

  }


  return (
    <div className="timeline">
      {trackData?.map((item: any, index) => (
        <div className="timeline-content" key={index}>
          <div className="timeline-period">{item?.codesDtl1description}</div>
          <div className="timeline-title text-secondary">Food SKU Stage
          </div>
          <div className='fw-fold h6'>
            {item?.codesDtl1description}
          </div>
<br></br>

          {/* <div className="timeline-title text-secondary">Time
          </div> */}
          <div className='fw-fold h6'>
            {item?.description}
          </div>
          <br></br>



          <div className="timeline-title text-secondary">Time
          </div>
          <div className='fw-fold h6'>
            <FormattedDate timestamp={item?.actionTime} />
          </div>

        </div>
      ))

      }



      {/* Add more timeline-content divs as needed */}
    </div>
  );
};

export default Timeline;
