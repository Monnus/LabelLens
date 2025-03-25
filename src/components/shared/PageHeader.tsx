interface PageHeaderProps {
  title: string;
  description?: string;
}

const PageHeader = ({ title, description }: PageHeaderProps) => {
  return (
    <div className="text-center mb-8">
      <h1 className="text-3xl font-bold mb-2">{title}</h1>
      {description && (
        <p className="text-muted-foreground">{description}</p>
      )}
    </div>
  );
};

export default PageHeader;