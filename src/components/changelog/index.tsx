import { Changelog, ChangelogEntry } from '@/components/changelog/changelog';
import changelogData from '@/components/changelog/changelog.json';

const changelogEntries = changelogData as ChangelogEntry[];

const ChangelogPage = () => {
  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <Changelog entries={changelogEntries} />
    </div>
  );
};

export default ChangelogPage;
