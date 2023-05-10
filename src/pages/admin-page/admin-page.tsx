import { useTranslation } from 'react-i18next';
import 'src/pages/admin-page/admin-page.scss';
import { useAuth } from "@packages/contexts/auth";
import { useI18n } from '@/i18n/useI18n';


export const AdminPage = () => {
  const { t } = useI18n("Common");
  const { auth: { currentUser } } = useAuth();

  return (
    <>
      Admin Page
    </>
  );
};
export default AdminPage;
