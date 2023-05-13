'use client';

import TimeAgo, { TimeAgoProps } from 'timeago-react';

interface CustomTimeAgoProps extends Omit<TimeAgoProps, 'ref'> {}

const CustomTimeAgo: React.FC<CustomTimeAgoProps> = ({ datetime, live, opts, locale }) => {
  return <TimeAgo datetime={datetime} live={live} opts={opts} locale={locale} />;
};

export default CustomTimeAgo;
