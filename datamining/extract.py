# Extrae la información de los archivos de excel proporcionados
# por la gente del congreso
from openpyxl import load_workbook
import json
import re
import distance

blacklisted_authors = [
    'HORARIO DE COMIDA',
    'RECESO',
    'Traslado',
    'Receso para carteles',
]

def from_h(hour):
    return hour.split('-')[0].strip()

def to_h(col, row, worksheet):
    if cell in worksheet.merged_cells:
        end = next(filter(lambda r:r.startswith(cell+':'), worksheet.merged_cell_ranges))
        endrow = end.split(':')[1][1:]

        return worksheet['A{}'.format(endrow)].value.split('-')[1].strip()
    else:
        return worksheet['A{}'.format(row)].value.split('-')[1].strip()

def get_author(string):
    matches = re.match(r'(.*) "(.*)"', string)

    if matches: return matches.group(1), matches.group(2)
    else: return None, None

def get_title(author, talk_names):
    for name in talk_names:
        if name.startswith(author):
            matches = re.search(r'(.*) "(.*)"', name)
            
            if matches:
                return matches.group(2)
            else:
                return name

# Use levenshtein's distance to get the closes title
    min_title = ''
    min_distance = float('inf')
    for subauth, subtitle in filter(lambda x:x[0], map(get_author, talk_names)):
        cur_dis = distance.levenshtein(subauth, author)

        if cur_dis < min_distance:
            min_distance = cur_dis
            min_title = subtitle

    if min_title:
        return min_title
    else:
        return 'not_found. Is it no educativa?'

if __name__ == '__main__':
    workbook = load_workbook(filename='areas.xlsx')

    sheet_names = workbook.get_sheet_names()

    organized_data = []

    for sheet_name in sheet_names:
        worksheet = workbook[sheet_name]

        talk_names = tuple(filter(lambda x:x, map(lambda c:c[0].value, worksheet['A26:A70'])))

        for row in range(6, 23 + 1):
            for col in map(chr, range(66, 70 + 1)):
                cell = '{}{}'.format(col, row)

                if worksheet[cell].value and not worksheet[cell].value in blacklisted_authors:
                    organized_data.append({
                        'author': worksheet[cell].value,
                        'area'  : worksheet['A1'].value,
                        'place' : worksheet['A2'].value.replace('Nombre del salón: ', ''),
                        'day'   : worksheet['{}5'.format(col)].value,
                        'from'  : from_h(worksheet['A{}'.format(row)].value),
                        'to'    : to_h(col, row, worksheet),
                        'title' : get_title(worksheet[cell].value, talk_names),
                    })

    json.dump(organized_data, open('organized_data.json', 'w'), indent=2)
